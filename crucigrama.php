<?php
class Record
{

    private $server;
    private $user;
    private $pass;
    private $dbname;

    public function __construct()
    {
        $this->server = "localhost";
        $this->user = "DBUSER2023";
        $this->pass = "DBPSWD2023";
        $this->dbname = "records";
    }

    public function connect()
    {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        if ($conn->connect_error) {
            die("Error de conexión: " . $conn->connect_error);
        }
        return $conn;
    }

    /**
     * Guarda el tiempo del usuario en la base de datos
     */
    public function saveRecord()
    {
        $conn = $this->connect();
        $stmt = $conn->prepare("INSERT INTO $this->dbname.registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");

        $stmt->bind_param("sssi", $_POST["nombre"], $_POST["apellidos"], $_POST["nivel"], $_POST["tiempo"]);

        if (!$stmt->execute()) {
            die("alert(Error: " . $stmt->error);
        }

        $stmt->close();
        $conn->close();
    }

    /**
     * Obtiene los 10 mejores tiempos de la base de datos
     */
    public function get10Records()
    {
        $conn = $this->connect();
        $sql = "SELECT * FROM $this->dbname.registro ORDER BY tiempo ASC LIMIT 10";

        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            echo "<section>";
            echo "<h2>Top 10 jugadores</h2>";
            echo "<ol>";

            while ($row = $result->fetch_assoc()) {
                echo "<li>";
                echo "Nombre: " . $row["nombre"] . ", ";
                echo "Apellidos: " . $row["apellidos"] . ", ";
                echo "Nivel: " . $row["nivel"] . ", ";
                echo "Tiempo: " . $row["tiempo"];
                echo "</li>";
            }

            echo "</ol>";
            echo "</section>";
        } else {
            echo "0 resultados";
        }

        $conn->close();
    }
}
?>

<!DOCTYPE HTML>
<html lang="es">

<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <meta name="author" content="Sergio Murillo Álvarez" />
    <meta name="description" content="Juego de crucigrama matemático" />
    <meta name="keywords" content="juegos, entretenimiento, matemática, suma, resta, multiplicación" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Escritorio Virtual</title>
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/crucigrama.css" />
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

    <section>
        <h2>Lista de juegos</h2>
        <ul>
            <li><a href="memoria.html" accesskey="u" tabindex="8">Juego de memoria</a></li>
            <li><a href="sudoku.html" accesskey="d" tabindex="9">Sudoku</a></li>
            <li><a href="crucigrama.php" accesskey="c" tabindex="10">Crucigrama matemático</a></li>
            <li><a href="diario.html" accesskey="r" tabindex="11">Diario de viaje</a></li>
            <li><a href="php/zoo.php" accesskey="z" tabindex="12">Zoo interactivo</a></li>
        </ul>
    </section>

    <h2>Crucigrama matemático</h2>
    <main>

    </main>

    <?php
    if (count($_POST) > 0) {
        $record = new Record();
        $record->saveRecord();
        $record->get10Records();
    }
    ?>

    <section data-type="botonera">
        <h2>Botonera</h2>
        <button onclick="crucigrama.introduceElement(1)">1</button>
        <button onclick="crucigrama.introduceElement(2)">2</button>
        <button onclick="crucigrama.introduceElement(3)">3</button>
        <button onclick="crucigrama.introduceElement(4)">4</button>
        <button onclick="crucigrama.introduceElement(5)">5</button>
        <button onclick="crucigrama.introduceElement(6)">6</button>
        <button onclick="crucigrama.introduceElement(7)">7</button>
        <button onclick="crucigrama.introduceElement(8)">8</button>
        <button onclick="crucigrama.introduceElement(9)">9</button>
        <button onclick="crucigrama.introduceElement('*')">*</button>
        <button onclick="crucigrama.introduceElement('+')">+</button>
        <button onclick="crucigrama.introduceElement('-')">-</button>
        <button onclick="crucigrama.introduceElement('/')">/</button>
    </section>

    <script src="js/crucigrama.js"></script>
</body>



</html>