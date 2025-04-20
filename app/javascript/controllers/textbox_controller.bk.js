// app/javascript/controllers/textbox_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["charBoxContainer", "form", "formContent"]
  static values = { maxLength: Number } // 最大文字数
  
  connect() {
    // デフォルトの最大文字数（サーバーから渡されなければ20とする）
    this.maxLength = this.hasMaxLengthValue ? this.maxLengthValue : 20;
    
    // 最大文字数に基づいて入力ボックスを作成
    this.createFixedCharBoxes(this.maxLength);
    
    // 最初のボックスにフォーカス
    setTimeout(() => {
      const firstBox = this.getFirstEmptyBox();
      if (firstBox) firstBox.focus();
    }, 100);
  }
  
  createFixedCharBoxes(count) {
    const container = this.charBoxContainerTarget;
    container.innerHTML = "";
    
    // 固定数の入力ボックスを作成
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
    
    // 入力イベントの処理
    charBox.addEventListener("input", (e) => this.handleCharBoxInput(e, charBox));
    charBox.addEventListener("keydown", (e) => this.handleKeyDown(e, charBox));
    
    // フォーカス時に適切なボックスに移動
    charBox.addEventListener("focus", (e) => {
      // 左から順に埋めるために、フォーカスを適切なボックスに移動
      const firstEmptyBox = this.getFirstEmptyBox();
      if (firstEmptyBox && charBox !== firstEmptyBox) {
        e.preventDefault();
        firstEmptyBox.focus();
      }
    });
    
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
    
    // 表示テキストを短く（最大4文字）
    const displayText = objectId.length > 4 ? objectId.substring(0, 4) : objectId;
    objectBox.textContent = displayText;
    
    return objectBox;
  }
  
  handleCharBoxInput(event, charBox) {
    // スペースの入力を禁止
    if (charBox.innerText.includes(' ')) {
      charBox.innerText = charBox.innerText.replace(/\s+/g, '');
    }
    
    // 入力を1文字に制限
    if (charBox.innerText.length > 1) {
      charBox.innerText = charBox.innerText.charAt(0);
    }
    
    // 入力後に次のボックスにフォーカス
    if (charBox.innerText.length === 1) {
      // 次の空の入力ボックスを取得して自動フォーカス
      const nextBox = this.findNextEmptyBox();
      if (nextBox) {
        setTimeout(() => nextBox.focus(), 0);
      }
    }
  }
  
  handleKeyDown(event, charBox) {
    // Backspaceキーの処理
    if (event.key === "Backspace") {
      // バックスペースが押されたら、常に右端の要素を削除
      event.preventDefault();
      this.deleteRightmostElement();
    }
    
    // スペースキーの入力を禁止
    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
    }
  }
  
  // 一番右端の要素（文字またはオブジェクト）を削除する
  deleteRightmostElement() {
    // すべての要素を配列で取得
    const allElements = Array.from(this.charBoxContainerTarget.children);
    
    // 右端から左に向かって順番に検索し、一番右にある有効な要素を見つける
    for (let i = allElements.length - 1; i >= 0; i--) {
      const element = allElements[i];
      
      // 文字入力ボックスで、内容がある場合
      if (element.dataset.type === "char-box" && element.innerText.trim() !== "") {
        // 内容を消去
        element.innerText = "";
        
        // 最初の空ボックスにフォーカス
        const firstEmptyBox = this.getFirstEmptyBox();
        if (firstEmptyBox) {
          firstEmptyBox.focus();
        }
        
        return; // 削除完了
      }
      
      // オブジェクトボックスの場合
      if (element.dataset.type === "object-box") {
        // オブジェクトの位置を記録
        const position = parseInt(element.dataset.position || 0);
        
        // オブジェクトを削除
        element.remove();
        
        // 削除したオブジェクトの位置に3つの入力ボックスを追加
        this.restoreInputBoxes(position, 3);
        
        // 最初の空ボックスにフォーカス
        const firstEmptyBox = this.getFirstEmptyBox();
        if (firstEmptyBox) {
          firstEmptyBox.focus();
        }
        
        return; // 削除完了
      }
    }
  }
  
  // 指定位置に指定数の入力ボックスを追加
  restoreInputBoxes(position, count) {
    const container = this.charBoxContainerTarget;
    const allBoxes = Array.from(container.children);
    
    // 挿入位置の要素
    const elementAtPosition = allBoxes.find(box => parseInt(box.dataset.position) === position);
    
    // 指定数の入力ボックスを作成
    for (let i = 0; i < count; i++) {
      const charBox = this.createCharBox(position + i);
      
      // 挿入位置が見つかれば、その位置に挿入
      if (elementAtPosition) {
        container.insertBefore(charBox, elementAtPosition);
      } else {
        // なければ最後に追加
        container.appendChild(charBox);
      }
    }
    
    // 位置を再計算
    this.updateAllPositions();
  }
  
  // すべての要素の位置属性を更新
  updateAllPositions() {
    const allElements = Array.from(this.charBoxContainerTarget.children);
    allElements.forEach((element, index) => {
      element.dataset.position = index;
    });
  }
  
  // 最初の空のボックスを取得
  getFirstEmptyBox() {
    const boxes = Array.from(this.charBoxContainerTarget.children);
    return boxes.find(box => 
      box.dataset.type === "char-box" && box.innerText.trim() === ""
    );
  }
  
  // 次の空の入力ボックスを探す（左から最初の空ボックス）
  findNextEmptyBox() {
    return this.getFirstEmptyBox();
  }
  
  // ボタンクリック時のアクション
  insertObject(event) {
    const objectId = event.currentTarget.dataset.objectId;
    const objectValue = event.currentTarget.dataset.objectValue;
    
    // 空き入力ボックスが3つ以上あるか確認
    const emptyBoxes = this.getEmptyBoxes();
    if (emptyBoxes.length < 3) {
      alert("空きスペースが足りません。オブジェクトの挿入には3つの空きが必要です。");
      return;
    }
    
    // 最初の空きボックスの位置を特定
    const firstEmptyBox = emptyBoxes[0];
    const insertPosition = parseInt(firstEmptyBox.dataset.position);
    
    // 3つの空の入力ボックスを削除
    for (let i = 0; i < 3; i++) {
      if (emptyBoxes[i]) {
        emptyBoxes[i].remove();
      }
    }
    
    // オブジェクトボックスを作成
    const objectBox = this.createObjectBox(objectId, objectValue);
    objectBox.dataset.position = insertPosition;
    
    // ドキュメント上の適切な位置にオブジェクトを挿入
    const container = this.charBoxContainerTarget;
    const allElements = Array.from(container.children);
    
    // 挿入位置より大きい位置の最初の要素を見つける
    const nextElement = allElements.find(el => parseInt(el.dataset.position) > insertPosition);
    
    if (nextElement) {
      container.insertBefore(objectBox, nextElement);
    } else {
      container.appendChild(objectBox);
    }
    
    // 位置属性を更新
    this.updateAllPositions();
    
    // 次の空きボックスにフォーカス
    const nextEmptyBox = this.getFirstEmptyBox();
    if (nextEmptyBox) {
      nextEmptyBox.focus();
    }
  }
  
  // 空の入力ボックスをすべて取得
  getEmptyBoxes() {
    const boxes = Array.from(this.charBoxContainerTarget.children);
    return boxes.filter(box => 
      box.dataset.type === "char-box" && box.innerText.trim() === ""
    );
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
  
  submitForm() {
    try {
      // フォームを送信
      const content = this.collectContent();
      console.log("送信内容:", content);
      
      this.formContentTarget.value = content;
      this.formTarget.submit();
    } catch (error) {
      console.error("送信エラー:", error);
      alert("送信中にエラーが発生しました。");
    }
  }
}