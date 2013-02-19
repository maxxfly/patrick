patrick
=======

Librairie en Javascript utilisant Raphael.js pour faire des histogrammes et des courbes.

Exemple
-------

```html
<div id="graph_1"></div>
<div id="graph_2"></div>

<script>

  var visitors = { "values":[{"label": "12/01/22", "value": 8828},
                             {"label": "12/01/23", "value": 8691},
                             {"label": "12/01/24", "value": 9702},
                             {"label": "12/01/25", "value": 8799},
                             {"label": "12/01/26", "value": 7928},
                             {"label": "12/01/27", "value": 7235},
                             {"label": "12/01/28", "value": 7666};

  var inscrits = { "values":[{"label": "12/01/22", "value": 700},
                             {"label": "12/01/23", "value": 850},
                             {"label": "12/01/24", "value": 500},
                             {"label": "12/01/25", "value": 400},
                             {"label": "12/01/26", "value": 320},
                             {"label": "12/01/27", "value": 450},
                             {"label": "12/01/28", "value": 560};


    paper_1 = create_graph("graph_1", visitors, {width: 600, height: 250, left_margin: 50, bottom_margin: 50});
    draw_histo(paper_1, visitors, "90-#FFF-#76c4fb");
    draw_histo(paper_1, inscrits, "90-#FFF-#ff46f8");

    paper_2 = create_graph("graph_2", visitors, {width: 600, height: 250, left_margin: 50, bottom_margin: 50});
    curve_1 = draw_curve(paper_2, visitors, { color: "#76c4fb" });
    create_tracing(curve_1);

    curve_2 = draw_curve(paper_2, inscrits,  { color: "#ff46f8" });
</script>

```

La fonction [draw_curse()] permet de dessiner un segment se promenant sur la courbe (et uniquement sur la courbe) dans le temps montrant les differentes valeurs

Bugs
----

- un seul draw_curse est utilisable par graph
- pas de draw_curse pour les histos
