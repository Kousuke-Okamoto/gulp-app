
//スムーズスクロール
export function scroll() {
    // 1. すべてのhref="#"のaタグを取得
    const scrollTrigger = document.querySelectorAll('.js-scroll');

    // 2. 1のaタグにそれぞれクリックイベントを設定
    for (let i = 0; i < scrollTrigger.length; i++) {
        scrollTrigger[i].addEventListener('click', (e) => {

            // 3. ターゲットの位置を取得
            e.preventDefault();
            let href = scrollTrigger[i].getAttribute('href'); // 各a要素のリンク先を取得
            let targetElement = document.getElementById(href.replace('#', '')); // リンク先の要素（コンテンツ）を取得

            const rect = targetElement.getBoundingClientRect().top; // ブラウザからの高さを取得
            const offset = window.pageYOffset; // 現在のスクロール量を取得
            const gap = 60; // 固定ヘッダー分の高さ
            const target = rect + offset - gap; //最終的な位置を割り出す

            // 4. スムースにスクロール
            window.scrollTo({
                top: target,
                behavior: 'smooth',
            });

        });

    }
}