# server raptornodes.com
Shared SmartNode Hosting Raptoreum.
- [Website offical](raptornodes.com)
- [Live demo for Dev raptornodes.xyz](raptornodes.xyz)

## Nội dung

- [Cài đặt thư viện](#cài-đặt-thư-viện)
	- [Cài đặt thư viện cho website](#cài-đặt-thư-viện-cho-website)
	- [Cài đặt ví Raptoreum](#cài-đặt-ví-ratoreum)
	- [Cấu hình App Discord](#cấu-hình-app-discord)
- [Build và Run website](#build-và-run-website)
- [Cấu hình khác](#config)
- [Developer](#developer)

## Cài đặt thư viện
Cài đặt thư viện cho backend - frontend hoạt động, và ví Raptoreum.
- nodejs
- pm2
- mongodb
- redis
### Cài đặt thư viện cho website
See [Install nodejs and pm2](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04).
See [Install mongodb](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/).
#### Cài đặt nodejs
```bash
sudo apt update
```
```bash
cd ~
curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh

```
```bash
sudo bash nodesource_setup.sh
```
```bash
sudo apt install nodejs
```
kiểm tra hoàn tất
```bash
node -v
```
Output: v14.2.0
#### Cài đặt pm2
```bash
npm i pm2 -g
```
kiểm tra hoàn tất
```bash
pm2 ls
```
#### Cài đặt mongodb
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add –
```
```bash
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
```
```bash
sudo apt-get update
```
```bash
sudo apt-get install -y mongodb-org=5.0.2 mongodb-org-database=5.0.2 mongodb-org-server=5.0.2 mongodb-org-shell=5.0.2 mongodb-org-mongos=5.0.2 mongodb-org-tools=5.0.2
```
Sart Mongodb
```bash
sudo systemctl start mongod
```
nếu nhận lỗi Failed to start mongod.service: Unit mongod.service not found fix bằng lệnh
```bash
sudo systemctl daemon-reload
```




Thư mục chứa resource và wallet : /usr/web/server-raptornodes

## Build và Run website

### Install the dependencies
```bash
npm install
```

### Start the app in development mode 
```bash
npm run debug
```

### Lint the files
```bash
npm run lint
```

### Build the app for production
```bash
npm run build

```
or
```bash
sudo npm run build

```
## Config

## Developer
huyquansu

Date: December 7
