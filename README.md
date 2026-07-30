# 3D 複式顯微鏡互動實驗室

一套可直接部署到 GitHub Pages 的純前端生物互動教材。學生可旋轉觀察 3D 複式顯微鏡、點擊辨認部件、抽換草履蟲、眼蟲、渦蟲與藻類玻片，並模擬倍率、倒像、亮度、粗調與細調對焦、玻片移動及目鏡視野。

## 線上網站

- GitHub Repository: https://github.com/educatres/microscope
- GitHub Pages: https://educatres.github.io/microscope/
- 直接進入顯微鏡視野: https://educatres.github.io/microscope/?mode=missions

手機與 iPad 會自動略過 3D 模型並直接進入顯微鏡視野，以避免 iOS／行動裝置的 WebGL 載入問題。

## 功能

- Three.js 3D 顯微鏡，可旋轉、縮放與點擊部件
- 目鏡 10×／15×，物鏡 4×／10×／40×
- 粗調節輪、細調節輪、燈泡亮度、光圈互動
- 載玻片移動與視野反向移動
- 圓形目鏡視野、倍率縮放、亮度與模糊模擬
- 九種真實顯微影像玻片，包含 Kalanchoe、Tilia、碘液染色口腔細胞、草履蟲與眼蟲
- 獨立顯微鏡視野分頁與即時操作回饋
- RWD，可在桌機、平板與手機使用

## 本機預覽

ES Modules 需要透過 HTTP 伺服器開啟：

```bash
python3 -m http.server 8000
```

瀏覽 `http://localhost:8000`。

## 部署至 GitHub Pages

1. 建立新的 GitHub repository。
2. 將本專案全部檔案上傳到 repository 根目錄。
3. 進入 **Settings → Pages**。
4. 在 **Build and deployment** 選擇 **Deploy from a branch**。
5. Branch 選擇 `main`，資料夾選擇 `/ (root)`，按 **Save**。
6. 等候 GitHub Pages 完成部署後，即可取得公開網址。

## 注意

目前 Three.js 與顯微影像從 CDN／Wikimedia Commons 載入，因此瀏覽時需要網路。若需完全離線，可把函式庫與影像下載到專案內，再修改 `index.html` 與 `js/app.js` 的路徑。
