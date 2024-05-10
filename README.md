个人主页
https://wendellgong.github.io/  
PID模拟器小工具
https://wendellgong.github.io/pid-simulator

<div>
    <style>        /* 可选的CSS样式 */
        .mermaid svg {
            display: block;
            margin: auto;
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <script>        document.addEventListener('DOMContentLoaded', function () {
            mermaid.initialize({
                startOnLoad: true,
                theme: 'default' // 可选择其他主题
            });

            // 将Mermaid代码转换为SVG
            var pieChart = `                pie
                    title Key elements in Product X
                    "Calcium" : 42.96
                    "Potassium" : 50.05
                    "Magnesium" : 10.01
                    "Iron" : 5
            `;
            var element = document.getElementById('pie-chart');
            element.innerHTML = mermaid.mermaidAPI.render('pie-chart', pieChart);
        });
    </script>
    <div id="pie-chart"></div>
</div>