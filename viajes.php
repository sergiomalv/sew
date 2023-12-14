<!DOCTYPE HTML>
<html lang="es">

<?php
class Carrusel {
    public function __construct($capital, $pais) { 
        $this->capital = $capital;
        $this->pais = $pais;
    }

    public function getPhotos() {
        $params = array(
            'tags' => $this->capital . ',' . $this->pais,
            'tagmode' => 'any',
            'format' => 'php_serial',
        );

        $encoded_params = array();
        foreach ($params as $k => $v){
            $encoded_params[] = urlencode($k).'='.urlencode($v);
        }

        $url = "https://api.flickr.com/services/feeds/photos_public.gne?".implode('&', $encoded_params);
        
        $rsp = file_get_contents($url);
        $rsp_obj = unserialize($rsp);
        $result = "<section> <h2>Carrusel de imágenes</h2>";

        $contador = 0;
        foreach ($rsp_obj['items'] as $photos => $photo) {
            $result .= '<img src="' . $photo['m_url'] . '" alt="Imagen para el carrusel"/>';
            $contador++;
            if ($contador >= 10) {
                break;
            }
        }

        $result .= '<button data-action="next"> > </button> <button data-action="prev"> < </button> </section>';
        echo($result);

    }

}

?>

<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" /> 
    <meta name="author" content="Sergio Murillo Álvarez" />
    <meta name="description" content="Contenido referente a la posición	del usuario y mi viaje por Eslovenia" />
    <meta name="keywords" content="viajes, turismo, posición, mapa, geocalización, eslovenia" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Escritorio Virtual</title>
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/viajes.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="icon" href="multimedia/imagenes/favicon.png" />
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
</head>

<body>
    <header>
        <h1>Escritorio Virtual</h1>
        <nav>
            <a href="index.html" accesskey="i" tabindex="1">Inicio</a>
            <a href="sobremi.html" accesskey="s" tabindex="2">Sobre mi</a>
            <a href="noticias.html" accesskey="n" tabindex="3">Noticias</a>
            <a href="agenda.html" accesskey="a" tabindex="4">Agenda</a>
            <a href="meteorologia.html" accesskey="m" tabindex="5">Meteorología</a>
            <a href="viajes.php" accesskey="v" tabindex="6">Viajes</a>
            <a href="juegos.html" accesskey="j" tabindex="7">Juegos</a>
        </nav>
    </header>   

    <?php
        $carrusel = new Carrusel("Bratislava", "Eslovaquia");
        $carrusel->getPhotos();
    ?>

    <section>
        <h2>Opciones de usuario</h2>
        <button onclick="viajes.getMapaEstaticoGoogle();">Obtener posición estática del usuario</button>

        <label for='xml'>Selecciona un XML para su lectura:</label>
        <input type='file' name='xml' id='xml' onchange='viajes.readXML(this.files)'/>

        <label for="kml">Selecciona los KMLs para su representación en el mapa dinámico</label>
        <input type="file" name="kml" id="kml" onchange="viajes.readKML(this.files)" multiple/>

        <label for="svg">Selecciona los SVGs para su representación</label>
        <input type="file" name="svg" id="svg" onchange="viajes.readSVG(this.files)" multiple/>

    </section>

    <h2>Mapa dinámico</h2>
    <main id="mapa">
        
    </main>
    <script async defer
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDNYwpCoKDYjjnqyD2f3N0dD_7c72ogl8Q&callback=viajes.getMapaDinamicoGoogle"></script>
    <script src="js/viajes.js"></script>

</body>

</html>