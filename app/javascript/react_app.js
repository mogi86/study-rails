import React from 'react'
import { createRoot } from 'react-dom/client'

// TaskApp コンポーネント
const TaskApp = () => {
  const [tasks, setTasks] = React.useState([])
  const [filter, setFilter] = React.useState('all')
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  // CSRFトークンを取得
  const getCSRFToken = () => {
    const token = document.querySelector('[name="csrf-token"]')
    return token ? token.content : ''
  }

  // APIリクエストの共通ヘッダー
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'X-CSRF-Token': getCSRFToken()
  })

  // タスク一覧を取得
  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/v1/tasks')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setError('タスクの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // コンポーネントマウント時にタスクを取得
  React.useEffect(() => {
    fetchTasks()
  }, [])

  // タスク作成
  const createTask = async (taskData) => {
    try {
      const response = await fetch('/api/v1/tasks', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ task: taskData })
      })
      
      if (response.ok) {
        const newTask = await response.json()
        setTasks([newTask, ...tasks])
        return { success: true }
      } else {
        const errorData = await response.json()
        return { success: false, errors: errorData.errors }
      }
    } catch (error) {
      console.error('Error creating task:', error)
      return { success: false, errors: ['タスクの作成に失敗しました'] }
    }
  }

  // タスク更新
  const updateTask = async (taskId, taskData) => {
    try {
      const response = await fetch(`/api/v1/tasks/${taskId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ task: taskData })
      })
      
      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(tasks.map(task => 
          task.id === taskId ? updatedTask : task
        ))
        return { success: true }
      } else {
        const errorData = await response.json()
        return { success: false, errors: errorData.errors }
      }
    } catch (error) {
      console.error('Error updating task:', error)
      return { success: false, errors: ['タスクの更新に失敗しました'] }
    }
  }

  // タスク削除
  const deleteTask = async (taskId) => {
    if (!confirm('本当に削除しますか？')) {
      return
    }

    try {
      const response = await fetch(`/api/v1/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId))
      } else {
        alert('タスクの削除に失敗しました')
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      alert('タスクの削除に失敗しました')
    }
  }

  // 完了状態の切り替え
  const toggleComplete = async (taskId) => {
    try {
      const response = await fetch(`/api/v1/tasks/${taskId}/toggle_complete`, {
        method: 'PATCH',
        headers: getHeaders()
      })
      
      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(tasks.map(task => 
          task.id === taskId ? updatedTask : task
        ))
      } else {
        alert('タスクの更新に失敗しました')
      }
    } catch (error) {
      console.error('Error toggling task:', error)
      alert('タスクの更新に失敗しました')
    }
  }

  // フィルタリング
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed
    if (filter === 'pending') return !task.completed
    return true
  })

  // 統計情報
  const taskStats = {
    all: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length
  }

  if (loading) {
    return React.createElement('div', { className: 'container mx-auto px-4 py-8' },
      React.createElement('div', { className: 'max-w-4xl mx-auto text-center' },
        React.createElement('div', { className: 'animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto' }),
        React.createElement('p', { className: 'mt-4 text-gray-600' }, '読み込み中...')
      )
    )
  }

  if (error) {
    return React.createElement('div', { className: 'container mx-auto px-4 py-8' },
      React.createElement('div', { className: 'max-w-4xl mx-auto' },
        React.createElement('div', { className: 'bg-red-50 border border-red-200 rounded-md p-4' },
          React.createElement('div', { className: 'flex' },
            React.createElement('div', { className: 'ml-3' },
              React.createElement('h3', { className: 'text-sm font-medium text-red-800' }, 'エラーが発生しました'),
              React.createElement('div', { className: 'mt-2 text-sm text-red-700' },
                React.createElement('p', null, error)
              )
            )
          )
        ),
        React.createElement('div', { className: 'mt-4 text-center' },
          React.createElement('button', {
            onClick: fetchTasks,
            className: 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
          }, '再試行')
        )
      )
    )
  }

  return React.createElement('div', { className: 'container mx-auto px-4 py-8' },
    React.createElement('div', { className: 'max-w-4xl mx-auto' },
      // Header
      React.createElement('div', { className: 'text-center mb-8' },
        React.createElement('h1', { className: 'text-3xl font-bold text-gray-900 mb-2' }, '⚛️ React版タスク管理'),
        React.createElement('p', { className: 'text-gray-600' }, 'ReactとRails APIで作成したタスク管理アプリ'),
        React.createElement('div', { className: 'mt-4' },
          React.createElement('a', {
            href: '/tasks',
            'data-turbo': 'false',
            className: 'inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
          }, '⚡ Hotwire版を見る')
        )
      ),
      
      // Task Form (シンプル版)
      React.createElement(TaskForm, { onSubmit: createTask }),
      
      // Task Filter (シンプル版)
      React.createElement(TaskFilter, { filter, setFilter, taskCount: taskStats }),
      
      // Task List (シンプル版)
      React.createElement(TaskList, {
        tasks: filteredTasks,
        onUpdate: updateTask,
        onDelete: deleteTask,
        onToggleComplete: toggleComplete
      })
    )
  )
}

// シンプルなTaskFormコンポーネント
const TaskForm = ({ onSubmit }) => {
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])

    const result = await onSubmit({
      title: title.trim(),
      description: description.trim()
    })

    if (result.success) {
      setTitle('')
      setDescription('')
    } else {
      setErrors(result.errors || ['タスクの作成に失敗しました'])
    }

    setLoading(false)
  }

  return React.createElement('div', { className: 'bg-white shadow-lg rounded-lg p-6 mb-8' },
    React.createElement('h2', { className: 'text-xl font-semibold text-gray-900 mb-4' }, '✏️ 新しいタスクを作成'),
    
    errors.length > 0 ? React.createElement('div', { className: 'bg-red-50 border border-red-200 rounded-md p-4 mb-4' },
      React.createElement('div', { className: 'text-sm text-red-700' },
        React.createElement('ul', { className: 'list-disc list-inside space-y-1' },
          errors.map((error, index) => React.createElement('li', { key: index }, error))
        )
      )
    ) : null,

    React.createElement('form', { onSubmit: handleSubmit, className: 'space-y-4' },
      React.createElement('div', null,
        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'タスク名 *'),
        React.createElement('input', {
          type: 'text',
          value: title,
          onChange: (e) => setTitle(e.target.value),
          className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
          placeholder: '例: 買い物に行く',
          required: true,
          disabled: loading
        })
      ),
      
      React.createElement('div', null,
        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, '説明（任意）'),
        React.createElement('textarea', {
          value: description,
          onChange: (e) => setDescription(e.target.value),
          rows: 3,
          className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
          placeholder: '例: 牛乳、パン、卵を買う',
          disabled: loading
        })
      ),
      
      React.createElement('div', { className: 'flex justify-end' },
        React.createElement('button', {
          type: 'submit',
          disabled: loading || !title.trim(),
          className: 'px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50'
        }, loading ? '作成中...' : '📝 タスクを作成')
      )
    )
  )
}

// シンプルなTaskFilterコンポーネント
const TaskFilter = ({ filter, setFilter, taskCount }) => {
  const filters = [
    { key: 'all', label: '全て', icon: '📝', count: taskCount.all },
    { key: 'pending', label: '未完了', icon: '⏳', count: taskCount.pending },
    { key: 'completed', label: '完了', icon: '✅', count: taskCount.completed }
  ]

  return React.createElement('div', { className: 'bg-white shadow-lg rounded-lg p-6 mb-8' },
    React.createElement('h2', { className: 'text-xl font-semibold text-gray-900 mb-4' }, '🔍 タスクフィルター'),
    
    React.createElement('div', { className: 'flex flex-wrap gap-2' },
      filters.map((filterOption) => 
        React.createElement('button', {
          key: filterOption.key,
          onClick: () => setFilter(filterOption.key),
          className: `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            filter === filterOption.key
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`
        }, `${filterOption.icon} ${filterOption.label} (${filterOption.count})`)
      )
    )
  )
}

// シンプルなTaskListコンポーネント
const TaskList = ({ tasks, onUpdate, onDelete, onToggleComplete }) => {
  if (tasks.length === 0) {
    return React.createElement('div', { className: 'bg-white shadow-lg rounded-lg p-8 text-center' },
      React.createElement('p', { className: 'text-gray-500 text-lg' }, 'タスクがありません'),
      React.createElement('p', { className: 'text-gray-400 text-sm mt-2' }, '上記のフォームから新しいタスクを作成してください')
    )
  }

  return React.createElement('div', { className: 'space-y-3' },
    React.createElement('div', { className: 'flex items-center justify-between mb-4' },
      React.createElement('h2', { className: 'text-xl font-semibold text-gray-900' }, '📋 タスク一覧'),
      React.createElement('span', { className: 'text-sm text-gray-500' }, `${tasks.length} 件のタスク`)
    ),
    
    React.createElement('div', { className: 'space-y-3' },
      tasks.map((task) => 
        React.createElement(TaskItem, {
          key: task.id,
          task,
          onUpdate,
          onDelete,
          onToggleComplete
        })
      )
    )
  )
}

// シンプルなTaskItemコンポーネント
const TaskItem = ({ task, onUpdate, onDelete, onToggleComplete }) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const [title, setTitle] = React.useState(task.title)
  const [description, setDescription] = React.useState(task.description || '')

  const handleUpdate = async (e) => {
    e.preventDefault()
    const result = await onUpdate(task.id, {
      title: title.trim(),
      description: description.trim()
    })
    if (result.success) {
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return React.createElement('div', { className: 'bg-white shadow-lg rounded-lg p-6' },
      React.createElement('form', { onSubmit: handleUpdate, className: 'space-y-4' },
        React.createElement('input', {
          type: 'text',
          value: title,
          onChange: (e) => setTitle(e.target.value),
          className: 'w-full px-3 py-2 border border-gray-300 rounded-md',
          required: true
        }),
        React.createElement('textarea', {
          value: description,
          onChange: (e) => setDescription(e.target.value),
          className: 'w-full px-3 py-2 border border-gray-300 rounded-md',
          rows: 3
        }),
        React.createElement('div', { className: 'flex justify-end space-x-2' },
          React.createElement('button', {
            type: 'button',
            onClick: () => setIsEditing(false),
            className: 'px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200'
          }, 'キャンセル'),
          React.createElement('button', {
            type: 'submit',
            className: 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
          }, '更新')
        )
      )
    )
  }

  return React.createElement('div', { 
    className: `bg-white shadow-lg rounded-lg p-6 ${task.completed ? 'opacity-75' : ''}` 
  },
    React.createElement('div', { className: 'flex items-start space-x-3' },
      React.createElement('input', {
        type: 'checkbox',
        checked: task.completed,
        onChange: () => onToggleComplete(task.id),
        className: 'mt-1'
      }),
      
      React.createElement('div', { className: 'flex-1' },
        React.createElement('h3', { 
          className: `text-lg font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}` 
        }, task.title),
        
        task.description && React.createElement('p', { 
          className: `mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}` 
        }, task.description),
        
        React.createElement('div', { className: 'mt-2 text-xs text-gray-500' },
          `作成: ${task.created_at}`
        )
      ),
      
      React.createElement('div', { className: 'flex items-center space-x-2' },
        React.createElement('button', {
          onClick: () => setIsEditing(true),
          className: 'text-blue-600 hover:text-blue-800'
        }, '編集'),
        React.createElement('button', {
          onClick: () => onDelete(task.id),
          className: 'text-red-600 hover:text-red-800'
        }, '削除')
      )
    )
  )
}

document.addEventListener('DOMContentLoaded', () => {
  const reactAppElement = document.getElementById('react-task-app')
  
  if (reactAppElement) {
    const root = createRoot(reactAppElement)
    root.render(React.createElement(TaskApp))
  }
}) 