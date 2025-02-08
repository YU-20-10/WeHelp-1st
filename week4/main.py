from fastapi import FastAPI, Request, Body, Response
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from starlette.middleware.sessions import SessionMiddleware
import json
import uuid

userInstallData = {"username": "test", "password": "test", "agreeAll": "on"}

tempUserData = {}

app = FastAPI()
app.add_middleware(
    SessionMiddleware,
    secret_key=uuid.uuid4(),
    session_cookie="member_signin",
    path="/",
)


app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


class SigninData(BaseModel):
    username: str
    password: str
    agreeAll: bool


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")


@app.post("/signin", response_class=JSONResponse)
async def signin(request: Request, body=Body(None)):
    userData = json.loads(body)
    # 如果未輸入返回error由前端跳轉
    if not userData["username"] or not userData["password"]:
        return JSONResponse(
            content={"redirect": "/error?message=帳號或密碼未輸入"}, status_code=302
        )
    elif userInstallData != userData:
        return JSONResponse(
            content={"redirect": "/error?message=帳號或密碼輸入錯誤"}, status_code=302
        )
    elif userInstallData == userData:
        request.session["userName"] = userData["username"]
        return JSONResponse(content={"redirect": "/member"}, status_code=200)


@app.get("/member", response_class=HTMLResponse)
async def member(request: Request):
    signinCookie = request.cookies.get("member_signin")
    if signinCookie is not None:
        return templates.TemplateResponse(request=request, name="member.html")
    else:
        return RedirectResponse(
            url="/?alertMessage=尚未登入或是登入驗證已過期", status_code=307
        )


@app.get("/error", response_class=HTMLResponse)
async def errorMessageFn(request: Request, message: str):
    return templates.TemplateResponse(
        request=request, name="error.html", context={"message": message}
    )


@app.get("/signout", response_class=JSONResponse)
async def signoutFn(request: Request, response: Response):
    if "userName" in request.session:
        del request.session["userName"]
        response.delete_cookie("member_signin", path="/")
    return JSONResponse(
        content={"redirect": "/?alertMessage=已登出系統"}, status_code=200
    )
