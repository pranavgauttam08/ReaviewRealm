from pydantic import BaseModel
from fastapi import Form


class registerUser(BaseModel):
    first_name: str = Form(...)
    last_name: str = Form(...)
    email: str = Form(...)
    password: str = Form(...)
