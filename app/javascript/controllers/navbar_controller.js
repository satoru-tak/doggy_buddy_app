// app/javascript/controllers/navbar_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["mobileMenu", "userMenu"]

  connect() {
    // クリックイベントを設定
    this.clickOutsideHandler = this.clickOutside.bind(this)
    document.addEventListener("click", this.clickOutsideHandler)
    console.log("Navbar controller connected")
  }

  disconnect() {
    // イベントリスナーの解除
    document.removeEventListener("click", this.clickOutsideHandler)
  }

  toggleMobileMenu(event) {
    event.stopPropagation()
    if (this.hasMobileMenuTarget) {
      this.mobileMenuTarget.classList.toggle("hidden")
      
      // ユーザーメニューが開いていたら閉じる
      if (this.hasUserMenuTarget && !this.userMenuTarget.classList.contains("hidden")) {
        this.userMenuTarget.classList.add("hidden")
      }
    }
  }

  toggleUserMenu(event) {
    event.stopPropagation()
    if (this.hasUserMenuTarget) {
      this.userMenuTarget.classList.toggle("hidden")
      
      // モバイルメニューが開いていたら閉じる
      if (this.hasMobileMenuTarget && !this.mobileMenuTarget.classList.contains("hidden")) {
        this.mobileMenuTarget.classList.add("hidden")
      }
    }
  }

  // 外部クリックでメニューを閉じる
  clickOutside(event) {
    // コントローラーの要素外をクリックした場合
    if (!this.element.contains(event.target)) {
      // 開いているメニューを閉じる
      if (this.hasMobileMenuTarget && !this.mobileMenuTarget.classList.contains("hidden")) {
        this.mobileMenuTarget.classList.add("hidden")
      }
      
      if (this.hasUserMenuTarget && !this.userMenuTarget.classList.contains("hidden")) {
        this.userMenuTarget.classList.add("hidden")
      }
    }
  }
}