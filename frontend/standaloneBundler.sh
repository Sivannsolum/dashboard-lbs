#!/bin/bash
revisions=$(curl https://vsrm.dev.azure.com/dtonic/AIMS-ui/_apis/release/releases?api-version=6.1-preview.8)
dashboard="Dashboard"
dashboardNew="DashboardNew"
echo $revisions >> revisions.json

node ./updateRevision.js

rm revisions.json

node ./editPublicPath.js server $dashboardNew
npm run build
tar.exe -cvzf dist_DashboardNew.zip dist

node ./editPublicPath.js server $dashboard
npm run build
tar.exe -cvzf dist_Dashboard.zip dist
