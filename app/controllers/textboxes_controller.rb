# app/controllers/textboxes_controller.rb
class TextboxesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [ :submit ] # AJAXリクエスト用

  def index
    @objects = [
      { id: "A", value: "ABC" },
      { id: "B", value: "DEF" },
      { id: "C", value: "GHI" },
      { id: "D", value: "JKL" },
      { id: "E", value: "MNO" }
    ]
  end

  def submit
    # コンテンツを取得（通常のフォーム送信とJSONリクエストの両方に対応）
    content = params[:content] || JSON.parse(request.body.read)["content"] rescue nil

    # セッションに保存するか、DBに保存するか、必要な処理を行う
    session[:textbox_content] = content

    respond_to do |format|
      format.html { redirect_to result_path }
      format.json { redirect_to result_path }
    end
  end

  def result
    @content = session[:textbox_content]
    # 結果表示ページ
  end
end
