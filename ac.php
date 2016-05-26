<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Nyarlathotep Channel</title>

        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
        <!-- Meu CSS -->
        <link href="css/estilo.css" rel="stylesheet" type="text/css">

    </head>
    <body>
        
        <div class="container">
            <div class="page-header">
                <h1>Anime</h1>
            </div>
            <ul class="row">
            <?php
                $iterator =0;
                $jsonurl = "http://a.4cdn.org/a/catalog.json";
                $json = file_get_contents($jsonurl);
                $json_output = json_decode($json);

                foreach ($json_output as $page) {
                    foreach($page->threads as $thread) {
                        
                        if (isset($thread->sub)){
                            $sub  = $thread->sub;    
                        //}
                            //else{
                            //    $sub  = "";    
                           // }
                            $no  = $thread->no;
                            if (isset($thread->com)){
                                $com  = $thread->com;
                                if(strlen ($com)>100){
                                    $com = substr($com, 0, 100)."'...</a>";
                                }
                            }
                            else{
                                $com  = "";    
                            }
                            $ext  = $thread->ext;
                            $name  = $thread->name;
                            $tim  = $thread->tim;


                            if($iterator%3==0){
                                echo "<li class='clearfix visible-xs-block'></li>";
                            }
                            if($iterator%4==0){
                                echo "<li class='clearfix visible-sm-block'></li>";
                            }
                            if($iterator%6==0){
                                echo "<li class='clearfix visible-lg-block  visible-md-block'></li>";
                            }

                            $iterator++;

                            echo "<li class='col-lg-2 col-md-2 col-sm-3 col-xs-4 col-xxs-12'>";

                            if('.webm' === $ext){
                                //echo "<video controls autoplay><source src='http://i.4cdn.org/a/".$tim.$ext."'type='video/webm' //codecs='vp8, vorbis'></video>";

                            }
                            else{
                                echo "<img class='img-responsive' src='http://i.4cdn.org/a/".$tim.$ext."'>";
                            }
                            echo "<div class='text'><h4>".$sub."</h4>".$com."</div></li>";
                        }
                    }
                }
            ?>
            </ul>
        </div>        
        
        
        <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        <!-- Bootstrap -->
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
    </body>
</html>