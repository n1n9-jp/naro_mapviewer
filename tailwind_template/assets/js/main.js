
document.addEventListener("DOMContentLoaded", () => {

  // 各navボタンの取得（ID指定）
  const dashboardLink = document.getElementById("dashboard");
  const dataLink = document.getElementById("datachange");
  const vizLink = document.getElementById("vizchange");
  
  // nav全体のリンクを配列にまとめる
  const navLinks = [dashboardLink, dataLink, vizLink];

  // 外側コンテナとパネルの取得
  const slideOverContainer = document.getElementById("slideOverContainer");
  const sidepanel = document.getElementById("sidepanel");
  
  // パネル内の閉じるボタンの取得
  const closeButton = sidepanel ? sidepanel.querySelector('button[type="button"]') : null;
  
  // slider内のタイトルと説明文の取得
  const contentTitle = sidepanel ? sidepanel.querySelector("#slide-over-title") : null;
  const contentDescription = sidepanel ? sidepanel.querySelector(".slider-description") : null;
  // slider内の4コラムコンテンツ領域の取得
  const contentContainer = sidepanel ? sidepanel.querySelector(".slider-content") : null;
  


  // navリンクをすべてクリック不可にする関数
  function disableNavLinks() {
    navLinks.forEach(link => {
      if (link) {
        link.classList.add('pointer-events-none');
      }
    });
  }
  


  // navリンクをクリック可能に戻す関数
  function enableNavLinks() {
    navLinks.forEach(link => {
      if (link) {
        link.classList.remove('pointer-events-none');
      }
    });
  }
  


  // active状態の更新：クリックされたリンクを active（ステイ表示）にする
  function updateActive(link) {
    navLinks.forEach(item => {
      if (item) {
        item.classList.remove("bg-gray-900", "text-white");
        item.classList.add("text-gray-300", "hover:bg-gray-700", "hover:text-white");
      }
    });
    if (link) {
      link.classList.remove("text-gray-300", "hover:bg-gray-700", "hover:text-white");
      link.classList.add("bg-gray-900", "text-white");
    }
  }
  


  // パネル閉鎖時に active状態を Dashboard のみにリセットする関数
  function resetActiveMenuToDashboard() {
    navLinks.forEach(item => {
      if (item) {
        item.classList.remove("bg-gray-900", "text-white");
        item.classList.add("text-gray-300", "hover:bg-gray-700", "hover:text-white");
      }
    });
    if (dashboardLink) {
      dashboardLink.classList.remove("text-gray-300", "hover:bg-gray-700", "hover:text-white");
      dashboardLink.classList.add("bg-gray-900", "text-white");
    }
  }
  


  // 各navリンクのクリックイベント設定
  navLinks.forEach(link => {
    if (link) {
      link.addEventListener("click", function(e) {
        e.preventDefault();
        updateActive(this);
        // 「データの変更」または「可視化スタイルの変更」ならパネルを開く
        if (this.id === "datachange" || this.id === "vizchange") {
          if (slideOverContainer && sidepanel) {
            slideOverContainer.classList.remove("hidden");
            void sidepanel.offsetWidth; // 強制再描画
            sidepanel.classList.remove("-translate-y-full");
            sidepanel.classList.add("translate-y-0");
            console.log("Slide-over panel opened");
            disableNavLinks();
            
            // slider内のタイトル、説明文、4コラムコンテンツの差し替え
            if (contentTitle && contentDescription && contentContainer) {
              if (this.id === "datachange") {
                contentTitle.textContent = "Data Modification";
                contentDescription.textContent = "Update your data using the options below.";
                contentContainer.innerHTML = `
                  <div class="grid grid-cols-4 gap-4">
                    <div class="bg-gray-200 p-4">
                        <div>Dir1</div>
                    </div>
                    <div class="bg-gray-200 p-4">
                        <div>Dir2</div>
                    </div>
                    <div class="bg-gray-200 p-4">
                        <div>Dir3</div>
                    </div>
                    <div class="bg-gray-200 p-4">
                        <div>Year</div>
                    </div>
                  </div>
                `;
              } else if (this.id === "vizchange") {
                contentTitle.textContent = "Visualization Style Change";
                contentDescription.textContent = "Customize the visualization style using the options below.";
                contentContainer.innerHTML = `
                  <div class="grid grid-cols-3 gap-4">
                    <div class="bg-gray-200 p-3">
                      <div>Value for Scale</div>
                    </div>
                    <div class="bg-gray-200 p-3">
                      <div>Visualization Color</div>
                    </div>
                    <div class="bg-gray-200 p-3">
                      <div>2D/3D Change</div>
                    </div>
                  </div>
                `;
              }
            }
          }
        }
        // 2D／3D切り替えや印刷はスライダーは開閉しないので、そのまま通常動作
      });
    }
  });
  


  // 閉じるボタンの処理
  if (closeButton && slideOverContainer && sidepanel) {
    closeButton.addEventListener("click", () => {
      sidepanel.classList.remove("translate-y-0");
      sidepanel.classList.add("-translate-y-full");
      console.log("Slide-over panel closing");
      setTimeout(() => {
        slideOverContainer.classList.add("hidden");
        resetActiveMenuToDashboard();
        enableNavLinks();
        if (dashboardLink) {
          dashboardLink.focus();
          console.log("Focus moved to Dashboard");
        }
      }, 500);
    });
  }

});