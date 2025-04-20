# app/services/estimate_generator.rb
require "prawn"
require "prawn/table"

class EstimateGenerator
  def self.generate_to_string
    # 横向き(landscape)を明示的に指定
    pdf = Prawn::Document.new(
      page_size: "A4",
      page_layout: :landscape,  # 横向きに変更
      margin: [ 40, 40, 40, 40 ]
    )

    # 日本語フォントの設定
    setup_fonts(pdf)

    # 内容の生成
    create_content(pdf)

    # レンダリングして文字列として返す
    pdf.render
  end

  def self.generate(filename = "mitsumori.pdf")
    Prawn::Document.generate(filename,
                             page_size: "A4",
                             page_layout: :landscape,  # 横向きに変更
                             margin: [ 40, 40, 40, 40 ]) do |pdf|
      # 日本語フォントの設定
      setup_fonts(pdf)

      # 内容の生成
      create_content(pdf)
    end
  end

  private

  def self.setup_fonts(pdf)
    begin
      # フォントの存在チェックとフォールバック
      font_normal = "#{Rails.root}/app/assets/fonts/ipaexm.ttf"
      font_bold = "#{Rails.root}/app/assets/fonts/ipaexg.ttf"

      # フォントファイルが存在しない場合はデフォルトを使用
      unless File.exist?(font_normal) && File.exist?(font_bold)
        Rails.logger.warn "Japanese fonts not found. Using default fonts."
        return
      end

      pdf.font_families.update({
        "JP" => {
          normal: font_normal,
          bold: font_bold
        }
      })
      pdf.font "JP"
    rescue => e
      # フォント設定エラー時のフォールバック処理
      Rails.logger.error "Font setup error: #{e.message}"
    end
  end

  def self.create_content(pdf)
    # 日付の表示 (右上)
    pdf.text_box "明治33年1月0日", at: [ pdf.bounds.right - 150, pdf.bounds.top ], size: 10

    # ヘッダー部分
    header_height = 40

    # 左側: 企業ロゴ用の枠
    pdf.stroke_rectangle [ 0, pdf.bounds.top ], 150, header_height
    pdf.text_box "企業ロゴ", at: [ 50, pdf.bounds.top - 15 ], size: 12

    # 中央: 見積書タイトル
    pdf.text_box "お見積書", at: [ (pdf.bounds.right - pdf.bounds.left) / 2 - 50, pdf.bounds.top - 5 ], size: 24
    pdf.text_box "【 精 密 指 輪 】", at: [ (pdf.bounds.right - pdf.bounds.left) / 2 - 50, pdf.bounds.top - 30 ], size: 12

    # 右側: 企業情報
    pdf.stroke_rectangle [ pdf.bounds.right - 200, pdf.bounds.top ], 200, header_height
    pdf.stroke_horizontal_line pdf.bounds.right - 200, pdf.bounds.right, at: pdf.bounds.top - 20
    pdf.stroke_horizontal_line pdf.bounds.right - 100, pdf.bounds.right, at: pdf.bounds.top

    pdf.text_box "企業名", at: [ pdf.bounds.right - 195, pdf.bounds.top - 15 ], size: 10
    pdf.text_box "オンライン", at: [ pdf.bounds.right - 95, pdf.bounds.top - 15 ], size: 10
    pdf.text_box "会社住所", at: [ pdf.bounds.right - 195, pdf.bounds.top - 35 ], size: 10
    pdf.text_box "TEL：0000-00-0000／Mail：kaisha@example.com", at: [ pdf.bounds.right - 195, pdf.bounds.top - 55 ], size: 8

    # 顧客情報部分
    pdf.move_down 60
    pdf.text "☑ 【              様 】", size: 12

    # 見積もり内容テーブル1
    pdf.move_down 10
    create_item_table(pdf)

    # 顧客情報部分2
    pdf.move_down 20
    pdf.text "☑ 【              様 】", size: 12

    # 見積もり内容テーブル2
    pdf.move_down 10
    create_item_table(pdf)

    # シンボルマーク部分
    pdf.move_down 20
    symbols = "※ ♥ 〜 円 ㊞"
    pdf.text_box symbols, at: [ 150, pdf.cursor ], size: 16

    # 合計金額
    pdf.text_box "合計金額", at: [ pdf.bounds.right - 200, pdf.cursor - 10 ], size: 12
    pdf.stroke_rectangle [ pdf.bounds.right - 200, pdf.cursor ], 200, 30
    pdf.text_box "0 円（税込）", at: [ pdf.bounds.right - 100, pdf.cursor - 20 ], size: 12

    # 注意事項
    pdf.move_down 60
    pdf.text "注意事項", size: 10
    pdf.move_down 5
    pdf.text "(1) お見積書の有効期限は左上記載日より（ 令和5年12月29日 まで）とさせていただきます。有効期限を過ぎますと価格に変動がある場合があります。", size: 8
    pdf.text "(2) こちらのお見積書は掲示時ではまだご注文完了とはなりませんので内容をご確認の上ご一報をお願いいたします。お支払いをいただきました後に指輪の作製を進めさせていただきます。", size: 8
    pdf.text "(3) アフター保証についてご不明がある場合には、サービス内容は有効となります。予めご了承ください。", size: 8
  end

  def self.create_item_table(pdf)
    # リング部分
    data = [
      [ "リング名 / 品番", { content: "金額", colspan: 1 } ],
      [ { content: "", height: 30 }, { content: "0 円", colspan: 1 } ]
    ]

    pdf.table(data, width: pdf.bounds.width) do |table|
      table.cells.border_width = 1
      table.cells.padding = 4
      table.cells.align = :center
      table.column(0).width = pdf.bounds.width * 0.75
      table.column(1).width = pdf.bounds.width * 0.25
    end

    # オプション部分
    data = [
      [ { content: "オプション（追加可）", colspan: 5 }, { content: "0 円", colspan: 1 } ]
    ]

    pdf.table(data, width: pdf.bounds.width) do |table|
      table.cells.border_width = 1
      table.cells.padding = 4
      table.cells.align = :center
      table.column(5).width = pdf.bounds.width * 0.25
    end

    # 素材部分
    data = [
      [ { content: "素材", rowspan: 2 }, { content: "ベース（金属のみい希望）", colspan: 1 }, { content: "サイズ", colspan: 1 }, { content: "表面加工", colspan: 1 }, { content: "内石", colspan: 1 }, { content: "", colspan: 1 }, { content: "0 円", colspan: 1 } ],
      [ { content: "パーツ（金属の少ない希望）", colspan: 1 }, { content: "", colspan: 1 }, { content: "(サンプル通り)", colspan: 1 }, { content: "", colspan: 1 }, { content: "", colspan: 1 }, { content: "0 円", colspan: 1 } ]
    ]

    pdf.table(data, width: pdf.bounds.width) do |table|
      table.cells.border_width = 1
      table.cells.padding = 4
      table.cells.align = :center
      table.column(0).width = 70
      table.column(6).width = pdf.bounds.width * 0.25
    end

    # 合計部分
    data = [
      [ { content: "合計", colspan: 5 }, { content: "0 円（税込）", colspan: 1 } ]
    ]

    pdf.table(data, width: pdf.bounds.width) do |table|
      table.cells.border_width = 1
      table.cells.padding = 4
      table.cells.align = :center
      table.column(5).width = pdf.bounds.width * 0.25
    end

    # ブランド名
    data = [
      [ { content: "ブランド名", colspan: 1 } ]
    ]

    pdf.table(data, width: pdf.bounds.width) do |table|
      table.cells.border_width = 1
      table.cells.padding = 4
      table.cells.align = :center
    end

    # 企業名部分
    data = [
      [ { content: "企業名", colspan: 1 }, { content: "", colspan: 24 } ]
    ]

    pdf.table(data, width: pdf.bounds.width) do |table|
      table.cells.border_width = 1
      table.cells.padding = 4
      table.cells.align = :center
      table.column(0).width = 70
    end
  end
end
