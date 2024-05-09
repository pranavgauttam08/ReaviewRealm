from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from datetime import datetime, timedelta
from config.db import collection
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="v1/auth/login")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


class TokenData(BaseModel):
    email: str | None = None


def verify_hashed_password(plain_password, hashed_password):
    return context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return context.hash(password)


def get_user(email: str):
    query = collection.find_one({"email": email})
    if bool(query):
        user_data = query
        return user_data


def authenticate_user(email: str, password: str):
    user = get_user(email=email)
    if not user:
        return False
    if not verify_hashed_password(
        plain_password=password, hashed_password=user["password"]
    ):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta or None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    jwt_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate access token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload["email"]
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise jwt_exception
    user = get_user(email=token_data.email)
    if user is None:
        raise credentials_exception
    return user
