class TextboxesController < ApplicationController
  def index
    # 指輪のサイズや刻印種別に応じて最大文字数を決定
    @max_characters = 20 # 例: 20文字を最大とする

    @objects = [
      { id: "内石", value: "誕生石" },
      { id: "月分", value: "誕生月" },
      { id: "マ①", value: "マーク1" },
      { id: "マ②", value: "マーク2" },
      { id: "マ③", value: "マーク3" },
      { id: "マ④", value: "マーク4" },
      { id: "マ⑤", value: "マーク5" }
    ]
  end

  def submit
    @content = params[:content]
    redirect_to result_path(content: @content)
  end

  def result
    @content = params[:content]
  end
end
