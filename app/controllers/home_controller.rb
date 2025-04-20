# app/controllers/home_controller.rb
class HomeController < ApplicationController
  def index
    # トップページ用のアクション
  end

  def generate_pdf
    respond_to do |format|
      format.html # 通常のHTMLビュー表示
      format.pdf do
        pdf = EstimateGenerator.generate_to_string
        send_data pdf,
                  filename: "見積書.pdf",
                  type: "application/pdf",
                  disposition: "inline"
      end
    end
  end

  def download_pdf
    pdf = EstimateGenerator.generate_to_string
    send_data pdf,
              filename: "見積書.pdf",
              type: "application/pdf",
              disposition: "attachment"
  end

  # app/controllers/home_controller.rb に追加するメソッド

  def simple_pdf
    # シンプルなPDFを生成
    pdf = Prawn::Document.new
    pdf.text "Hello, World! これは日本語のテストです。"
    pdf.move_down 20
    pdf.text "This is a simple PDF test."

    # 出力
    send_data pdf.render,
              filename: "simple.pdf",
              type: "application/pdf",
              disposition: "inline"
  end
end
