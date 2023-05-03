# Revelation Autoplay Piano

Vì dòng đời đưa đẩy, vì kiếm tiền, vì không thích, mà bạn không trở thành nhạc công?  
Nhưng bạn vẫn muốn đàn bằng tay hay như nhạc công soạn nhạc?  
Bạn muốn cả Guild trầm trồ mỗi tối tiệc hồ bơi?  

Đã có `revelation-autoplay-piano`!

Soạn bản nhạc yêu thích của bạn, mở game, ngồi vào đàn, nhấn phím tắt bắt đầu!  
Mọi việc còn lại hãy để tool lo :smile:

**Lưu ý**:  
*Yêu cầu chạy với quyền quản trị viên để sử dụng tool trên PC Client. Quyền người dùng chỉ chạy được trên giả lập thôi nha ^^*  

## About this app
This is a tool that allows you to compose music or import from a MIDI file, and then automatically play it with a piano (or any instrument that supports the display of piano-like keys) in a game (Or any other anywhere, in a browser or any other application).  

**Note**:  
In browser or game running in emulator, you can use this tool without doing anything.  
However, in some games (e.g. the desktop version of Revelation Mobile), user permission is not enough. Now you need to run this tool as administrator.  

## For Dev
### Requirements
+ Rust (rustc, cargo)
+ Visual Studio with C++ Build tools
+ Cmake
+ Yarn
+ Nodejs

### Dev
```bash
git clone https://github.com/cuikho210/revelation-autoplay-piano.git
cd revelation-autoplay-piano
yarn
yarn tauri dev
```

### Setup in Githhub, Build and Publish
Fork this repo.  
Clone it.  

Create a gist. Replace `src-tauri/tauri.conf.json/tauri/updater/endpoints[0]` with your username and gist id.  
Replace the gist id in `.github/workflows/main.yml` with your gist id.  

On windows, generate a updater key with this command:
```powershell
yarn tauri signer generate -w $HOME/.tauri/myapp.key
```

Replace `src-tauri/tauri.conf.json/tauri/updater/pubkey` with your public key.  

In your repo on github, create `TAURI_PRIVATE_KEY` and `TAURI_KEY_PASSWORD` secrets.  

Generate a new [Personal access token](https://github.com/settings/tokens). Only the gist scope is needed.  
Create a `GIST_TOKEN` secrets in your repo with the token you just created.  

Create a commit and branch `release`. Push to github.  
The new version will be built and released as a draft.  
The update file `latest.json` will be updated to the gist.  