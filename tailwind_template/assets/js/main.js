
// document.addEventListener("DOMContentLoaded", () => {

// 各navボタンの取得（ID指定）
const dataLink = document.getElementById("datachange");
const vizLink = document.getElementById("vizchange");
var selectedNav = "";

// nav全体のリンクを配列にまとめる
const navLinks = [dataLink, vizLink];

// 外側コンテナとパネルの取得
const slideOverContainer = document.getElementById("slideOverContainer");
const sidepanel = document.getElementById("sidepanel");

// パネル内の閉じるボタンの取得
const closeButton = sidepanel ? sidepanel.querySelector('button[type="button"]') : null;

// slider内のコンテンツの取得
const contentTitle = sidepanel ? sidepanel.querySelector("#slide-over-title") : null;
const contentDescription = sidepanel ? sidepanel.querySelector(".slider-description") : null;
const contentContainer = sidepanel ? sidepanel.querySelector(".slider-content") : null;


  
var disableNavLinks = function() {
  navLinks.forEach(link => {
    if (link) {
      link.classList.add('pointer-events-none');
      link.classList.remove("text-white", "bg-gray-900", "text-white", "hover:bg-gray-700", "hover:text-white");
      link.classList.add("text-gray-300");
    }
  });
}
  


var enableNavLinks = function() {
  navLinks.forEach(link => {
    if (link) {
      link.classList.remove('pointer-events-none');
      link.classList.remove("text-gray-300");
      link.classList.add("text-white", "bg-gray-900", "hover:bg-gray-700", "hover:text-white");
    }
  });
}
  


var setupNav = function() {
    // 各navリンクのクリックイベント設定
    navLinks.forEach(link => {
      if (link) {
        link.addEventListener("click", function(e) {
          e.preventDefault();
          // updateActive();

          // 「データの変更」または「可視化スタイルの変更」ならパネルを開く
          if (this.id === "datachange" || this.id === "vizchange") {
            if (slideOverContainer && sidepanel) {

              selectedNav = this.id;
              console.log("selectedNav", selectedNav);

              PubSub.publish('navlink:disabled');
              PubSub.publish('panel:open');
            }
          }
        });
      }
    });
}



var openPanel = function() {
  console.log("openPanel");

  slideOverContainer.classList.remove("hidden");
  void sidepanel.offsetWidth; // 強制再描画
  sidepanel.classList.remove("-translate-y-full");
  sidepanel.classList.add("translate-y-0");
  console.log("Slide-over panel opened");
  // disableNavLinks();

  // slider内のタイトル、説明文、4コラムコンテンツの差し替え
  if (contentTitle && contentDescription && contentContainer) {
    if (selectedNav === "datachange") {

      contentTitle.textContent = "データの変更";
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
    } else if (selectedNav === "vizchange") {

      contentTitle.textContent = "可視化の変更";
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



var setupPanel = function() {
    if (closeButton && slideOverContainer && sidepanel) {
      closeButton.addEventListener("click", () => {
        PubSub.publish('panel:close');
      });
    }
}



var closePanel = function() {
    console.log("closePanel");

    sidepanel.classList.remove("translate-y-0");
    sidepanel.classList.add("-translate-y-full");
    console.log("Slide-over panel closing");
    setTimeout(() => {
      slideOverContainer.classList.add("hidden");
      PubSub.publish('navlink:abled');
      // enableNavLinks();
    }, 500);
}



PubSub.subscribe('panel:setup', setupPanel);
PubSub.subscribe('panel:close', closePanel);
PubSub.subscribe('panel:open', openPanel);

PubSub.subscribe('navlink:setup', setupNav);
PubSub.subscribe('navlink:disabled', disableNavLinks);
PubSub.subscribe('navlink:abled', enableNavLinks);

PubSub.publish('navlink:setup');
PubSub.publish('panel:setup');

// });