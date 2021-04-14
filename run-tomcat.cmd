set DEPLOY_PATH=deploy-tomcat
set FRONTEND_PATH=frontend
set BACKEND_PATH=backend

pushd
cd .\%DEPLOY_PATH%
cmd /s /c "rmdir /s /q aims-ui\dist"

cd ..\%FRONTEND_PATH%
cmd /s /c "call npm install" || exit /b
cmd /s /c "call npm run build -- --dest ..\%DEPLOY_PATH%\aims-ui\dist" || exit /b

cd ..\%DEPLOY_PATH%
cmd /s /c "docker-compose build" || exit /b
cmd /s /c "docker-compose up"
popd
