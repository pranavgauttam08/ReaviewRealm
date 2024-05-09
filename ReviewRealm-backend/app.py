from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from config.db import db_ping

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from routes import auth
from routes import scrape


app.include_router(auth.router)
app.include_router(scrape.router)


@app.on_event("startup")
async def startup():
    db_ping()


@app.get("/")
async def hello():
    return {"msg": "hello from the backend!"}


if __name__ == "__main__":
    uvicorn.run("app:app", reload=True, host="127.0.0.1", port=8100)
