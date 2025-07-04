import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["checkbox", "content", "form"]
  static values = { id: Number }

  connect() {
    // コントローラーが接続されたときの処理
    console.log("Task controller connected for task", this.idValue)
  }

  toggle(event) {
    // チェックボックスの切り替え処理
    const checkbox = event.target
    const isCompleted = checkbox.checked
    
    // 視覚的フィードバックを即座に提供
    this.updateVisualState(isCompleted)
    
    // フォームを自動送信
    if (this.hasFormTarget) {
      this.formTarget.requestSubmit()
    }
  }

  updateVisualState(isCompleted) {
    // タスクの見た目を更新
    const taskElement = this.element.closest('.task-item')
    
    if (isCompleted) {
      taskElement.classList.add('opacity-75')
      // 完了時のアニメーション
      this.animateCompletion()
    } else {
      taskElement.classList.remove('opacity-75')
    }
  }

  animateCompletion() {
    // 完了時のアニメーション効果
    const taskElement = this.element.closest('.task-item')
    
    // 簡単なフェードアニメーション
    taskElement.style.transition = 'all 0.3s ease'
    taskElement.style.transform = 'scale(0.98)'
    
    setTimeout(() => {
      taskElement.style.transform = 'scale(1)'
    }, 300)
  }

  edit() {
    // 編集モードに切り替え
    console.log("Edit mode activated for task", this.idValue)
  }

  cancel() {
    // 編集をキャンセル
    console.log("Edit cancelled for task", this.idValue)
  }
} 