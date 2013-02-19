 function create_graph(id_div, str_datas, param)
    {      
      left_margin = param.left_margin;
      bottom_margin = param.bottom_margin
            
      param['width_segment'] = (param.width - left_margin)/str_datas.values.length;
    
      var paper = Raphael(id_div, param.width, param.height);
      paper.ca.param = param;    

      // creation de la grid 
      for(var i=0; i< str_datas.values.length; i++)
      {   
        e = paper.path("M"+ (( param.width - left_margin)/str_datas.values.length * i + left_margin) +" 0V"+ (param.height - bottom_margin) ).attr( { stroke: "#DDD"} );     
      }

      // on determine le max donc l'echelle 
      var max_value = 0;
      for(var i=0; i< str_datas.values.length; i++)
      {   
        max_value = Math.max(max_value, str_datas.values[i].value);
      }
      
      // definition de l'echelle a l'arrondie ... a revoir certainement 
      paper.ca.max_value = Math.pow(10, Math.ceil(Math.pow(max_value, 1/10) + 1))
            
      // creation de l'echelle verticale a partir de l'arrondie de l'echelle 
      if(left_margin)
      {
        for(var i=1; i< 10; i++)
        {
          paper.text(left_margin - 10, ( param.height - bottom_margin ) - i * ( param.height - bottom_margin )/10, paper.ca.max_value / 10 * i).attr({ "text-anchor": "end" } );      
        }
      }
      
      // creation de la legende en bas
      if(bottom_margin)
      {
        for(var i=0; i< str_datas.values.length; i++)
        {  
          paper.text((param.width - left_margin)/str_datas.values.length * (i + 0.5) + left_margin, (param.height - bottom_margin/2), str_datas.values[i].label ). rotate(-90);
        }
      }
      return paper;
    }
    
    // TODO : changer le passage de la couleur, en tant que object     
    function draw_histo(paper, str_datas, c)
    {
      for(var i=0; i< str_datas.values.length; i++)
      {     
      
        // on place nos barres avec animation 
        paper.rect(
                    paper.ca.param.width_segment * i + paper.ca.param.left_margin, (paper.height - paper.ca.param.bottom_margin) ,
                    paper.ca.param.width_segment ,  0  ,  5    
                  ).attr({stroke: "#357db0", fill: c}).animate( 
                  {  height: (str_datas.values[i].value / paper.ca.max_value * (paper.height - paper.ca.param.bottom_margin)), 
                     y: ((paper.height - paper.ca.param.bottom_margin) - (str_datas.values[i].value / paper.ca.max_value) * (paper.height - paper.ca.param.bottom_margin)) }, 1000 );
      }
    }
    
      
    function draw_curve(paper, str_datas, param)
    {
      // on definie notre premier point de la courbe
      str_curse = "M "+ (paper.ca.param.left_margin + paper.ca.param.width_segment/2)  + " "+ ((paper.height - paper.ca.param.bottom_margin) - (str_datas.values[0].value / paper.ca.max_value) * (paper.height - paper.ca.param.bottom_margin)) + "R";
  
      // et chaque element de la courbe
      for(i=1; i < str_datas.values.length; i++)
      {
        str_curse += " "+ (paper.ca.param.width_segment * (i+0.5) + paper.ca.param.left_margin) +" "+ ((paper.height - paper.ca.param.bottom_margin) - (str_datas.values[i].value / paper.ca.max_value) * (paper.height - paper.ca.param.bottom_margin))
      }
      
      return paper.path(str_curse).attr({stroke: param.color ? param.color : '#000', 
                                         "stroke-width": param.width ? param.width : 3,
                                         "stroke-dasharray": param.dasharray ? param.dasharray : ""
                                          }).data('json_datas', str_datas);      
    }
    
    function create_tracing(curve)
    {
      v =  curve.data('json_datas');
      curve.data('position', 0);
      paper = curve.paper;
      
      // on cree un ID aleatoire a la curve, ca peut etre pratique
      curve.id =  Math.floor(Math.random() * 100000);
      
      // TODO : encore un bug ici.. on redefinie along en fait si y'a 2 appel'
      // fonction de definition de la puce de tracage
      paper.ca.along = function(p)
      {

//        console.log(this.getSubpath(p- 7, p + 7));
        
        return {
          path: curve.getSubpath(p - 7, p + 7 )        
        };
        
        /*
        return {
          path: Raphael.getSubpath(curve, p - 7, p  + 7)
        };*/
      };      
      
      c = paper.path().attr({along: 0, stroke: "#ea3d4d", "stroke-width": 3});
      
      /* paper.ca.display_value_trace(0);       */
      display_value_trace(curve, 0, c, v);
      
    }
         
    function create_info_popupin(paper, t, x, y, c_id)
    {
      rand =  Math.floor(Math.random() * 100);
      r = paper.rect(x, y, 60, 20 , 5).attr({ "stroke-width": 2, "fill": "CCC", "fill-opacity": 0.7 });
      t = paper.text(x + 30, y + 10, t).attr({ "text-anchor": "middle" });
      
      r.id =  c_id + 1;
      t.id =  c_id + 2;      
    }
  
    // permet de retrouver une position "x" au sein d'une courbe, et retourne la longueur lié a cette position 
    function search_x_on_curve(c, x, start)
    {
      if(!start) { start = 0; }
      
      for(i = start; i < c.getTotalLength(); i++)
      {
       
        if(Math.round(c.getPointAtLength(i).x) == Math.round(x))
        {
          return i;
        }
      }
    }
  
    // reecriture de display_value_trace
    function display_value_trace(curve, a, c, v)
     {  
        paper = curve.paper; 
        
        /// TODO : rajouter un max/min pour eviter que la boite sort dans certains cas
        y_pos = (paper.ca.max_value - v.values[a].value) / paper.ca.max_value * (paper.height - paper.ca.param.bottom_margin);

        if( a < v.values.length / 2)
        {
          // si on est sur la premiere partie a gauche de la courbe, le popupin est a droite
          create_info_popupin(paper, 
                                    v.values[a].value, 
                                    ((a + 1.5) * paper.ca.param.width_segment) + paper.ca.param.left_margin, 
                                   y_pos ,
                                   curve.id

                                    );
        }
        else
        {
          // si on est a droite de la courbe, le popup in est a gauche
          create_info_popupin(paper, 
                                    v.values[a].value, 
                                    ((a - 0.5) * paper.ca.param.width_segment) + paper.ca.param.left_margin - 60, 
                                     y_pos ,
                                     curve.id

                              );
        }
        

        setTimeout(function() {
          // on vire le popupin
          paper.getById(curve.id + 1).remove();
          paper.getById(curve.id + 2 ).remove();          
          
          // et on fait le deplacement
          a=a+1;
          
          // cas ou le traceur est arriver au bout, on le ramene completement a gauche
          if( a == v.values.length)
          {
            a = 0; pos = 0;         
          }
          // cas normal, on avance
          else
          {                      
            pos = search_x_on_curve(curve, 
                                    paper.ca.param.width_segment * (a + 0.5) + paper.ca.param.left_margin, 
                                    curve.data('position') + Math.floor(paper.ca.param.width_segment)
                                    ); 
          }

          curve.data('position', pos);
          c.animate( {along: pos }, 1000, "linear", 
                     function() { display_value_trace(curve, a, c, v); } 
                    ) ;
          
        }, 2000);
        
        
      }
