class Api::V1::TasksController < ApplicationController
  before_action :set_task, only: [:show, :update, :destroy, :toggle_complete]
  protect_from_forgery with: :null_session
  
  def index
    @tasks = Task.recent
    render json: @tasks.map { |task| task_json(task) }
  end
  
  def show
    render json: task_json(@task)
  end
  
  def create
    @task = Task.new(task_params)
    
    if @task.save
      render json: task_json(@task), status: :created
    else
      render json: { 
        errors: @task.errors.full_messages,
        details: @task.errors.messages 
      }, status: :unprocessable_entity
    end
  end
  
  def update
    if @task.update(task_params)
      render json: task_json(@task)
    else
      render json: { 
        errors: @task.errors.full_messages,
        details: @task.errors.messages 
      }, status: :unprocessable_entity
    end
  end
  
  def destroy
    @task.destroy
    head :no_content
  end
  
  def toggle_complete
    @task.update(completed: !@task.completed)
    render json: task_json(@task)
  end
  
  private
  
  def set_task
    @task = Task.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Task not found' }, status: :not_found
  end
  
  def task_params
    params.require(:task).permit(:title, :description, :completed)
  end
  
  def task_json(task)
    {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      created_at: task.created_at.strftime("%Y年%m月%d日 %H:%M"),
      updated_at: task.updated_at.strftime("%Y年%m月%d日 %H:%M"),
      created_at_iso: task.created_at.iso8601,
      updated_at_iso: task.updated_at.iso8601
    }
  end
end 