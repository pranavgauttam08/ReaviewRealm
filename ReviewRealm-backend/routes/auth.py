from fastapi import Depends, APIRouter, HTTPException, status, Form, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from bleach import clean
from datetime import timedelta
from pydantic import ValidationError, BaseModel
from typing import Annotated
from config.db import collection
from models.register import registerUser
from utils import (
    get_password_hash,
    get_user,
    authenticate_user,
    create_access_token,
    get_current_user,
)


router = APIRouter(prefix="/v1/auth", tags=["authentication"])


class Token(BaseModel):
    access_token: str
    token_type: str


ACCESS_TOKEN_EXPIRE_MINUTES = 60


@router.post("/login", response_model=Token)
# async def login_for_access_token(email: str = Form(...), password: str = Form(...)):
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"email": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me/", response_model=registerUser)
async def read_users_me(
    current_user: Annotated[registerUser, Depends(get_current_user)]
):
    return current_user


@router.post("/register")
async def auth(
    req: Request,
    res: Response,
    email: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
    password: str = Form(...),
):
    try:
        hashed_pass = get_password_hash(password)
        new_user = registerUser(
            first_name=clean(first_name),
            last_name=clean(last_name),
            email=email,
            password=hashed_pass,
        )
        if get_user(email):
            res.status_code = status.HTTP_400_BAD_REQUEST
            return {"message": "Email already registered"}
        else:
            collection.insert_one(new_user.dict())
            res.status_code = status.HTTP_201_CREATED
            return {"message": "User registered successfully"}

    except ValidationError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Validation Error! Please retry!",
        )
