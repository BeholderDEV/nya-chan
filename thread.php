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
            
            <?php
                $thread =$_GET["number"];
                $board =$_GET["board"];
                $jsonurl = "http://a.4cdn.org/".$board."/thread/".$thread.".json";
                $json = file_get_contents($jsonurl);
                $json_output = json_decode($json);

                foreach($json_output->posts as $post) {
                    if (isset($post->bumplimit)) {

                        if (isset($post->sub)){
                            $sub  = $post->sub;    
                        }
                        else{
                            $sub  = "";    
                        }
                        $no  = $post->no;
                        if (isset($post->com)){
                            $com  = $post->com;

                        }
                        else{
                            $com  = "";    
                        }
                        $ext  = $post->ext;
                        $name  = $post->name;
                        $tim  = $post->tim;



                        echo "<div class='panel panel-default' id='".$no."'>";

                        echo "<div class='zero-clipboard'><span class='btn-clipboard'>";
                        echo "<a href='thread.php?board=".$board."&number=".$no."'>";
                        echo "<i class='fa fa-eye' title='Visualizar'></i>";
                        echo "</a>";
                        echo "<i class='fa fa-bookmark-o' title='Marcar'></i>";
                        echo "<i class='fa fa-refresh' title='Atualizar'></i>";
                        echo "<i class='fa fa-reply' title='Responder'></i>";
                        echo "</span></div>";
                        echo "<div class='panel-heading'>";



                        echo "<h3 class='panel-title'>".$sub." ~ <span> No.<a href='#".$no."'>".$no."</a> by ".$name."</span></h3>";

                        echo "</div>";

                        echo "<div class='panel-body'>";


                        if('.webm' === $ext){
                            echo "<video controls width='450' height='240'><source src='http://i.4cdn.org/".$board."/".$tim.$ext."'type='video/webm' codecs='vp8, vorbis'></video>";

                        }
                        else{
                            echo "<img src='http://i.4cdn.org/".$board."/".$tim.$ext."' class='img-responsive main-image image-md'>";
                        }

                        echo $com."</div><div class='panel-footer'>";
                        echo "<ul class='list-group'>";
                    }
                    else{
                        $hasImage=true;
                        $no  = $post->no;
                        if (isset($post->com)){
                            $com  = $post->com;

                        }
                        else{
                            $com  = "";    
                        }
                        if (isset($post->ext)){
                           $ext  = $post->ext;
                        }
                        else{
                            $ext  = "";
                            $hasImage=false;
                        }
                        if (isset($post->tim)){
                           $tim  = $post->tim;   
                        }
                        else{
                            $tim  = "";
                            $hasImage=false;
                        }

                        echo "<li class='list-group-item' id='p".$no."'>";

                        echo "<div class='zero-clipboard'><span class='com-btn-clipboard'>";
                        
                        echo "No.<a href='#".$no."'>".$no."</a> by ".$name;
                        
                        echo "</span></div>";
                        
                        if($hasImage){
                            if('.webm' === $ext){
                                echo "<video controls width='450' height='240'><source src='http://i.4cdn.org/".$board."/".$tim.$ext."'type='video/webm' codecs='vp8, vorbis'></video>";

                            }
                            else{
                                echo "<img src='http://i.4cdn.org/".$board."/".$tim.$ext."' class='img-responsive com-image image-sm'>";
                            }

                        }                            
                        echo $com."</li>";
                    }
                }
                echo "</ul></div></div>";
            ?>
        </div>
        <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        <!-- Bootstrap -->
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
        <script>
            $(".main-image").click(function(){
                $(this).toggleClass( "image-md" );
            });
            $(".com-image").click(function(){
                $(this).toggleClass( "image-sm" );
            });
        </script>
    </body>
</html>