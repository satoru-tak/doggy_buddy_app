// app/javascript/controllers/textbox_controller.js
import { Controller } from "@hotwired/stimulus"
import Sortable from "sortablejs"

export default class extends Controller {
  static targets = ["charBoxContainer", "dragItems", "form", "formContent"]
  static values = { maxLength: Number }
  
  connect() {
    console.log("Textbox controller connected");
    this.createInitialCharBoxes(10);  // 最初に10個の入力ボックスを表示
    this.setupDropZone();
    this.initDraggables();
  }
  
  createInitialCharBoxes(count) {
    const container = this.charBoxContainerTarget;
    container.innerHTML = "";
    
    // 指定数の入力ボックスを作成
    for (let i = 0; i < count; i++) {
      const charBox = this.createCharBox(i);
      container.appendChild(charBox);
    }
  }
  
  createCharBox(position) {
    // 一つの文字入力ボックス
    const charBox = document.createElement("div");
    charBox.classList.add("char-box", "w-10", "h-10", "border", "border-gray-300", 
                         "flex", "items-center", "justify-center", "mx-1", "mb-1");
    charBox.dataset.position = position;
    charBox.dataset.type = "char-box";
    
    // 入力できるようにする
    charBox.contentEditable = true;
    charBox.classList.add("focus:outline-none", "focus:border-blue-500");
    charBox.addEventListener("input", (e) => this.handleCharBoxInput(e, position));
    charBox.addEventListener("keydown", (e) => this.handleKeyDown(e, position));
    
    return charBox;
  }
  
  createObjectBox(objectId, objectValue) {
    // オブジェクトボックス（3つ分の幅）
    const objectBox = document.createElement("div");
    objectBox.classList.add("object-box", "h-10", "border", "border-blue-500", "bg-blue-100",
                           "flex", "items-center", "justify-center", "mx-1", "mb-1");
    objectBox.style.width = "calc(3 * 2.5rem)"; // 3つのボックス幅
    objectBox.dataset.type = "object-box";
    objectBox.dataset.objectId = objectId;
    objectBox.dataset.objectValue = objectValue;
    objectBox.textContent = `${objectId}: ${objectValue}`;
    
    return objectBox;
  }
  
  handleCharBoxInput(event, position) {
    const target = event.target;
    // 入力を1文字に制限
    if (target.innerText.length > 1) {
      target.innerText = target.innerText.charAt(0);
    }
    
    // 入力後に次のボックスにフォーカス
    if (target.innerText.length === 1) {
      this.focusNextElement(target);
    }
    
    // 必要に応じてボックスを追加
    this.ensureEnoughBoxes();
  }
  
  handleKeyDown(event, position) {
    // Backspaceキーの処理
    if (event.key === "Backspace" && event.target.innerText === "") {
      event.preventDefault();
      this.focusPrevElement(event.target);
    }
  }
  
  focusNextElement(element) {
    const next = element.nextElementSibling;
    if (next) {
      next.focus();
    } else {
      // 最後のボックスなら新しいボックスを追加
      const newBox = this.createCharBox(this.getNextPosition());
      this.charBoxContainerTarget.appendChild(newBox);
      newBox.focus();
    }
  }
  
  focusPrevElement(element) {
    const prev = element.previousElementSibling;
    if (prev) {
      // 前の要素がオブジェクトボックスの場合はさらに前へ
      if (prev.dataset.type === "object-box") {
        this.focusPrevElement(prev);
      } else {
        prev.focus();
        // カーソルを末尾に
        this.setEndOfContenteditable(prev);
      }
    }
  }
  
  setEndOfContenteditable(element) {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  getNextPosition() {
    const boxes = this.charBoxContainerTarget.children;
    return boxes.length;
  }
  
  ensureEnoughBoxes() {
    // 常に少なくとも3つの空の入力ボックスを確保
    const boxes = Array.from(this.charBoxContainerTarget.children);
    const emptyBoxes = boxes.filter(box => 
      box.dataset.type === "char-box" && box.innerText.trim() === ""
    );
    
    if (emptyBoxes.length < 3) {
      for (let i = 0; i < 3 - emptyBoxes.length; i++) {
        const newBox = this.createCharBox(this.getNextPosition());
        this.charBoxContainerTarget.appendChild(newBox);
      }
    }
  }
  
  setupDropZone() {
    // コンテナ全体をドロップゾーンとして設定
    Sortable.create(this.charBoxContainerTarget, {
      group: {
        name: 'shared',
        pull: false,
        put: true
      },
      animation: 150,
      sort: false,
      filter: '.object-box', // オブジェクトボックスはソート対象外
      onAdd: (evt) => {
        const item = evt.item;
        const objectId = item.dataset.objectId;
        const objectValue = item.dataset.objectValue;
        const index = evt.newIndex;
        
        // オブジェクトボックスを作成
        const objectBox = this.createObjectBox(objectId, objectValue);
        
        // ドロップ位置に挿入
        if (index < this.charBoxContainerTarget.children.length) {
          this.charBoxContainerTarget.insertBefore(objectBox, this.charBoxContainerTarget.children[index]);
        } else {
          this.charBoxContainerTarget.appendChild(objectBox);
        }
        
        // ドラッグされたアイテムを削除
        item.parentNode.removeChild(item);
        
        // 十分な入力ボックスを確保
        this.ensureEnoughBoxes();
      }
    });
  }
  
  initDraggables() {
    Sortable.create(this.dragItemsTarget, {
      group: {
        name: 'shared',
        pull: 'clone',
        put: false
      },
      animation: 150,
      sort: false
    });
  }
  
  collectContent() {
    // 全ての入力ボックスとオブジェクトボックスからテキストを収集
    let text = "";
    const boxes = Array.from(this.charBoxContainerTarget.children);
    
    boxes.forEach(box => {
      if (box.dataset.type === "char-box") {
        // 通常の入力ボックス
        text += box.innerText || "";
      } else if (box.dataset.type === "object-box") {
        // オブジェクトボックス
        text += box.dataset.objectValue || "";
      }
    });
    
    return text;
  }
  
  submitForm(event) {
    console.log("Submit form clicked");
    try {
      // フォームを送信
      const content = this.collectContent();
      console.log("Collected content:", content);
      
      if (this.hasFormContentTarget) {
        this.formContentTarget.value = content;
        
        if (this.hasFormTarget) {
          console.log("Submitting form...");
          this.formTarget.submit();
        } else {
          console.error("Form target not found");
          // フォールバック: 直接送信
          this.submitDirectly(content);
        }
      } else {
        console.error("Form content target not found");
        // フォールバック: 直接送信
        this.submitDirectly(content);
      }
    } catch (error) {
      console.error("Error in submitForm:", error);
      // フォールバック: 直接送信
      this.submitDirectly(this.collectContent());
    }
  }
  
  submitDirectly(content) {
    // フォームがない場合は直接リクエストを送信
    fetch("/textboxes/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").content
      },
      body: JSON.stringify({ content: content })
    })
    .then(response => {
      if (response.redirected) {
        window.location.href = response.url;
      }
    });
  }
}