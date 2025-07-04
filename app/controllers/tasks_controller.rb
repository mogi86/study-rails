class TasksController < ApplicationController
  before_action :set_task, only: [:show, :edit, :update, :destroy, :toggle_complete]

  def index
    @tasks = Task.recent
    @task = Task.new
  end

  def show
  end

  def new
    @task = Task.new
  end

  def create
    @task = Task.new(task_params)
    
    respond_to do |format|
      if @task.save
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.prepend("tasks", partial: "tasks/task", locals: { task: @task }),
            turbo_stream.update("task_form", partial: "tasks/form", locals: { task: Task.new })
          ]
        end
        format.html { redirect_to tasks_url, notice: 'タスクが作成されました。' }
      else
        format.turbo_stream do
          render turbo_stream: turbo_stream.update("task_form", partial: "tasks/form", locals: { task: @task })
        end
        format.html { render :new, status: :unprocessable_entity }
      end
    end
  end

  def edit
  end

  def update
    respond_to do |format|
      if @task.update(task_params)
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace("task_#{@task.id}", partial: "tasks/task", locals: { task: @task })
        end
        format.html { redirect_to tasks_url, notice: 'タスクが更新されました。' }
      else
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace("task_#{@task.id}", partial: "tasks/edit_form", locals: { task: @task })
        end
        format.html { render :edit, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @task.destroy
    
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.remove("task_#{@task.id}")
      end
      format.html { redirect_to tasks_url, notice: 'タスクが削除されました。' }
    end
  end

  def toggle_complete
    @task.update(completed: !@task.completed)
    
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace("task_#{@task.id}", partial: "tasks/task", locals: { task: @task })
      end
      format.html { redirect_to tasks_url }
    end
  end

  private

  def set_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:title, :description, :completed)
  end
end
