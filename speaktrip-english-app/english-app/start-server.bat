@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo   开口说 SpeakTrip - 本地预览
echo   ----------------------------------------
echo   电脑浏览器:  http://localhost:8080
echo   手机(同Wi-Fi): http://本机IP:8080
echo.
echo   提示: 手机通过局域网 IP 访问时，跟读评分不可用；
echo        正式使用请部署到 HTTPS（见 README）。
echo   ----------------------------------------
echo.
start "" http://localhost:8080
python -m http.server 8080
pause
