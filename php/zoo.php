<?php
class Zoo {

    private $server;
    private $user;
    private $pass;
    private $dbname;
    private $tables;
    private $conn;

    public function __construct() { 
        $this->server = "localhost";
        $this->user = "DBUSER2023";
        $this->pass = "DBPSWD2023";
        $this->dbname = "zoo";
        $this->tables = ["animal", "comida", "cuidador", "establo", "animalxcuidador"];

        $this->connect();
    }

    /**
     * Conexión a la base de datos
     */
    public function connect() {
        $this->conn = new mysqli($this->server, $this->user, $this->pass);
        if ($this->conn->connect_error) {
            die("Error de conexión: " . $this->conn->connect_error);
        }
    }

    /**
     * Exporta los datos de la base de datos a un archivo ZIP, los CSV tienen el nombre de la carpeta asociada
     */
    public function exportData() {
        // Accedemos a la información de cada tabla y la guardamos en un CSV
        foreach ($this->tables as $table) {
            $query = $this->conn->query("SELECT * FROM $this->dbname.$table");
            if ($query->num_rows > 0) {
                $filename = $table . ".csv";
                $handle = fopen($filename, 'w');
                
                $columns = array();
                while ($column = $query->fetch_field()) {
                    $columns[] = $column->name;
                }
                fputcsv($handle, $columns);
    
                // Añadir los datos a cada archivo CSV
                while ($row = $query->fetch_assoc()) {
                    fputcsv($handle, $row);
                }
    
                fclose($handle);
            }
        }
        // Creamos el archivo zoo.zip donde guardaremos todos los CSV
        $zip = new ZipArchive();
        $zipname = "zoo.zip";
        if ($zip->open($zipname, ZipArchive::CREATE)!==TRUE) {
            exit("cannot open <$zipname>\n");
        }

        // Añadimos los CSV al archivo ZIP
        foreach ($this->tables as $table) {
            $filename = $table . ".csv";
            $zip->addFile($filename);
        }
        // Finalizar y descargar el archivo ZIP
        $zip->close();

        header("Content-type: application/zip");
        header("Content-Disposition: attachment; filename = $zipname");
        header("Pragma: no-cache");
        header("Expires: 0");
        readfile($zipname);
        exit;
    }
    
    /**
     * Importa los datos de un archivo CSV a la base de datos
     * [IMPORTANTE] Se deben importar en este orden:
     * 1. establo.csv
     * 2. animal.csv
     * 3. cuidador.csv
     * 4. comida.csv
     * 5. animalxcuidador.csv
     */
    public function importData() {
        // Obtenemos el archivo CSV
        $archivoCSV = $_FILES["importar"];

        // Obtenemos el nombre de la tabla
        $nombreTabla = pathinfo($archivoCSV['name'], PATHINFO_FILENAME);

        // Abrimos el archivo CSV
        if (($handle = fopen($archivoCSV['tmp_name'], "r")) !== FALSE) {
            
            // Obtenemos el nombre de las columnas de la primera línea
            $nombreColumnas = fgetcsv($handle, 1000, ",");
            $nombreColumnas = implode(", ", $nombreColumnas);

            // Importamos los datos
            while (($datos = fgetcsv($handle, 1000, ",")) !== FALSE) {
                // Variables auxiliares
                $longitud = count($datos);      // Longitud de los datos
                $prepararValores = "";          // Valores a preparar para la consulta
                $tipoValores = "";              // Tipos de valores a insertar
                for ($i = 0; $i < $longitud; $i++) {
                    $tipoValores .= "s";
                    if ($i == $longitud - 1) {
                        $prepararValores .= "?";
                        break;
                    }
                    $prepararValores .= "?,";
                }
                
                $sql = "INSERT INTO $this->dbname.$nombreTabla ($nombreColumnas) VALUES ($prepararValores)";
                
                $sql = $this->conn->prepare($sql);
                $sql->bind_param($tipoValores, ...$datos);
                if ($sql->execute() === FALSE) {
                    echo "<p>Error al importar los datos: " . $this->conn->error . "</p>";
                    $sql->close();
                    return;
                }

            }
            fclose($handle);
            echo "<p>¡Datos importados correctamente!</p>";
        }
    }

    /**
     * Crea la base de datos y rellena la tabla en el caso de que no existan
     */
    public function prepararBase() {
        // Comprobar que la base de datos está zoo creada
        $sql = "CREATE DATABASE IF NOT EXISTS $this->dbname";
        if ($this->conn->query($sql) === TRUE) {
            echo "<p>Base de datos zoo creada correctamente</p>";
        } else {
            echo "<p>Error al crear la base de datos: " . $this->conn->error . "</p>";
            return;
        }

        // Seleccionar la base de datos zoo
        $this->conn->select_db($this->dbname);

        // Leer el script .sql y ejecutarlo en la base de datos zoo
        $sql = file_get_contents("script.sql");
        if ($this->conn->multi_query($sql) === TRUE) {
            echo "<p>Script ejecutado correctamente</p>";
        } else {
            echo "<p>Error: " . $this->conn->error . "</p>";
        }
    }

    /**
     * Muestra toda la información sobre los establos, animales y cuidadores
     * Permite conocer el ID de los establos, animales y cuidadores
     */
    public function verInformacion() {
        // Obtenemos todos los establos
        $sql = "SELECT * FROM $this->dbname.establo";
        $result = $this->conn->query($sql);
        $establos = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $establos[] = $row;
            }
        }

        // Recorremos todos los establos y obtenemos los animales que hay en cada uno
        for ($i = 0; $i < count($establos); $i++) {
            $sql = "SELECT * FROM $this->dbname.animal WHERE idEstablo = " . $establos[$i]["idEstablo"];
            $result = $this->conn->query($sql);
            $animales = [];
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $animales[] = $row;
                }
            }
            $establos[$i]["animales"] = $animales;
        }

        // Obtenemos todos los cuidadores
        $sql = "SELECT * FROM $this->dbname.cuidador";
        $result = $this->conn->query($sql);
        $cuidadores = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $cuidadores[] = $row;
            }
        }
        
        // Recorremos todos los cuidadores y obtenemos la comida que tiene cada uno
        for ($i = 0; $i < count($cuidadores); $i++) {
            $sql = "SELECT * FROM zoo.comida WHERE idCuidador = " . $cuidadores[$i]["idCuidador"];
            $result = $this->conn->query($sql);
            $comidas = [];
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $comidas[] = $row;
                }
            }
            $cuidadores[$i]["comidas"] = $comidas;
        }

        // Recorremos todos los cuidadores y obtenemos los animales que cuida cada uno
        for ($i = 0; $i < count($cuidadores); $i++) {
            $sql = "SELECT * FROM zoo.animalxcuidador WHERE idCuidador = " . $cuidadores[$i]["idCuidador"];
            $result = $this->conn->query($sql);
            $animales = [];
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $animales[] = $row;
                }
            }
            $cuidadores[$i]["animales"] = $animales;
        }

        // Presentamos toda la informacion sobre los establos y sus animales
        echo "<h3>Estado de los establos</h3>";
        for ($i = 0; $i < count($establos); $i++) {
            echo "<h4>". $establos[$i]["nombreEstablo"] . " - ID: " . $establos[$i]["idEstablo"] . "</h4>";

            if ($establos[$i]["capacidadEstablo"] == 3) {
                echo "<p>Establo vacío</p>";
            } else if ($establos[$i]["capacidadEstablo"] == 1) {
                echo "<p>Se le puede añadir " . $establos[$i]["capacidadEstablo"] . " animal</p>";
            } else {
                echo "<p>Se le puede añadir " . $establos[$i]["capacidadEstablo"] . " animales</p>";
            }

            echo "<ul>";
            for ($j = 0; $j < count($establos[$i]["animales"]); $j++) {
                echo "<li>Nombre: " . $establos[$i]["animales"][$j]["nombre"];
                echo "<ul>";
                echo "<li>ID: " . $establos[$i]["animales"][$j]["idAnimal"] . "</li>";
                echo "<li>Raza: " . $establos[$i]["animales"][$j]["raza"] . "</li>";
                echo "<li>Hambre: " . $establos[$i]["animales"][$j]["hambre"] . "</li>";
                echo "</ul>";
                echo "</li>";
            }
            echo "</ul>";
        }

        // Presentamos toda la informacion sobre los cuidadores y sus comidas
        echo "<h3>Lista de cuidadores</h3>";
        echo "<ul>";
        for ($i = 0; $i < count($cuidadores); $i++) {
            echo "<li>" . $cuidadores[$i]["nombreCuidador"] . " ( " . $cuidadores[$i]["edadCuidador"] .  " años) 
                ID: " . $cuidadores[$i]["idCuidador"];
            echo "<ul>";
            echo "<li>Comida: " . $cuidadores[$i]["comidas"][0]["nombreComida"] . 
                " - Unidades: " .  $cuidadores[$i]["comidas"][0]["unidades"] . "</li>";
            $result = "";
            for ($j = 0; $j < count($cuidadores[$i]["animales"]); $j++) {
                if ($j == count($cuidadores[$i]["animales"]) - 1) {
                    $result .= $cuidadores[$i]["animales"][$j]["idAnimal"];
                    break;
                }
                $result .= $cuidadores[$i]["animales"][$j]["idAnimal"] . " - ";
            }
            echo "<li>ID de animales a su cargo: " . $result . "</li>";
            echo "</li>";
            echo "</ul>";
        }
        echo "</ul>";
    }

    /**
     * Alimenta a un animal restando una unidad de hambre y resta una unidad de comida al cuidador
     */
    public function alimentarAnimal() {
        $idAnimal = $_POST["animal"];
        $idCuidador = $_POST["cuidadorComer"];
        print_r($_POST);

        // Comprobamos que los valores recibidos no son vacíos
        if ((empty($idAnimal) && ($idAnimal != 0))  || empty($idCuidador)) {
            echo "<p>¡No se han recibido todos los datos!</p>";
            return;
        }
    
        // Comprobamos que el animal existe
        $sql = $this->conn->prepare("SELECT nombre, raza FROM {$this->dbname}.animal WHERE idAnimal = ?");
        $sql->bind_param("i", $idAnimal);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows == 0) {
            echo "<p>¡El animal con ID $idAnimal no existe!</p>";
            $sql->close();
            return;
        }
        $row = $result->fetch_assoc();
        $nombreAnimal = $row["nombre"];
        $razaAnimal = $row["raza"];
        $sql->close();
    
        // Comprobamos que el cuidador existe
        $sql = $this->conn->prepare("SELECT nombreCuidador FROM {$this->dbname}.cuidador WHERE idCuidador = ?");
        $sql->bind_param("i", $idCuidador);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows == 0) {
            echo "<p>¡El cuidador con ID $idCuidador no existe!</p>";
            $sql->close();
            return;
        }
        $row = $result->fetch_assoc();
        $nombreCuidador = $row["nombreCuidador"];
        $sql->close();
    
        // Comprobamos que el animal está asociado a ese cuidador
        $sql = $this->conn->prepare("SELECT * FROM {$this->dbname}.animalxcuidador WHERE idAnimal = ? AND idCuidador = ?");
        $sql->bind_param("ii", $idAnimal, $idCuidador);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows == 0) {
            echo "<p>¡El animal $nombreAnimal no está asociado al cuidador $nombreCuidador!</p>";
            $sql->close();
            return;
        }
        $sql->close();
    
        // Comprobamos que el animal no está lleno
        $sql = $this->conn->prepare("SELECT * FROM {$this->dbname}.animal WHERE idAnimal = ? AND hambre > 0");
        $sql->bind_param("i", $idAnimal);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows == 0) {
            echo "<p>$nombreAnimal ($razaAnimal) está lleno</p>";
            $sql->close();
            return;
        }
        $sql->close();
    
        // Comprobamos que el cuidador tiene comida suficiente
        $sql = $this->conn->prepare("SELECT * FROM {$this->dbname}.comida WHERE idCuidador = ? AND unidades > 0");
        $sql->bind_param("i", $idCuidador);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows == 0) {
            echo "<p>El cuidador con ID $idCuidador no tiene comida suficiente</p>";
            $sql->close();
            return;
        }
        $sql->close();
    
        // Actualizamos el hambre del animal
        $sql = $this->conn->prepare("UPDATE {$this->dbname}.animal SET hambre = hambre - 1 WHERE idAnimal = ?");
        $sql->bind_param("i", $idAnimal);
        if ($sql->execute() === FALSE) {
            echo "<p>Error al actualizar el hambre del animal: " . $this->conn->error . "</p>";
            $sql->close();
            return;
        }
        $sql->close();
    
        // Restamos una unidad de comida al cuidador
        $sql = $this->conn->prepare("UPDATE {$this->dbname}.comida SET unidades = unidades - 1 WHERE idCuidador = ?");
        $sql->bind_param("i", $idCuidador);
        if ($sql->execute() === FALSE) {
            echo "<p>Error al actualizar la comida del cuidador: " . $this->conn->error . "</p>";
            $sql->close();
            return;
        }
        $sql->close();

        echo "<p>¡$nombreAnimal ($razaAnimal) ha comido! 
            El cuidador $nombreCuidador ha perdido una unidad de comida.</p>";
    }

    /**
     * Añade un animal a un establo y lo asocia a un cuidador
     */
    public function añadirAnimal() {
        $nombreAnimal = $_POST["nombreAnimal"];
        $razaAnimal = $_POST["razaAnimal"];
        $idEstablo = $_POST["establo"];
        $idCuidador = $_POST["cuidadorAñadir"];

        // Comprobamos que los valores recibidos no son vacíos
        if (empty($nombreAnimal) || empty($razaAnimal) || empty($idEstablo) || empty($idCuidador)) {
            echo "<p>¡No se han recibido todos los datos!</p>";
            return;
        }
    
        // Comprobamos que el establo existe
        $sql = $this->conn->prepare("SELECT * FROM {$this->dbname}.establo WHERE idEstablo = ?");
        $sql->bind_param("i", $idEstablo);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows == 0) {
            echo "<p>¡El establo con ID $idEstablo no existe!</p>";
            $sql->close();
            return;
        }
        $sql->close();
    
        // Comprobamos que el cuidador existe
        $sql = $this->conn->prepare("SELECT * FROM {$this->dbname}.cuidador WHERE idCuidador = ?");
        $sql->bind_param("i", $idCuidador);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows == 0) {
            echo "<p>¡El cuidador con ID $idCuidador no existe!</p>";
            $sql->close();
            return;
        }
        $sql->close();
    
        // Comprobamos que el establo no está lleno
        $sql = $this->conn->prepare("SELECT capacidadEstablo, nombreEstablo FROM {$this->dbname}.establo WHERE idEstablo = ?");
        $sql->bind_param("i", $idEstablo);
        $sql->execute();
        $result = $sql->get_result();
        $row = $result->fetch_assoc();
        $capacidadEstablo = $row["capacidadEstablo"];
        $nombreEstablo = $row["nombreEstablo"];
        if ($capacidadEstablo == 0) {
            echo "<p>¡$nombreEstablo está lleno!</p>";
            $sql->close();
            return;
        }
        $sql->close();
    
        // Añadimos el animal
        $sql = $this->conn->prepare("INSERT INTO {$this->dbname}.animal (nombre, raza, hambre, idEstablo) VALUES (?, ?, 5, ?)");
        $sql->bind_param("ssi", $nombreAnimal, $razaAnimal, $idEstablo);
        if ($sql->execute() === FALSE) {
            echo "<p>Error al añadir el animal: $nombreAnimal </p>";
            $sql->close();
            return;
        }
        $idAnimal = $this->conn->insert_id;
        $sql->close();
    
        // Actualizamos la capacidad del establo
        $sql = $this->conn->prepare("UPDATE {$this->dbname}.establo SET capacidadEstablo = capacidadEstablo - 1 WHERE idEstablo = ?");
        $sql->bind_param("i", $idEstablo);
        if ($sql->execute() === FALSE) {
            echo "<p>Error al actualizar la capacidad del establo</p>";
            $sql->close();
            return;
        }
        $sql->close();
    
        // Asociamos el animal al cuidador
        $sql = $this->conn->prepare("INSERT INTO {$this->dbname}.animalxcuidador (idAnimal, idCuidador) VALUES (?, ?)");
        $sql->bind_param("ii", $idAnimal, $idCuidador);
        if ($sql->execute() === FALSE) {
            echo "<p>Error al asociar el animal al cuidador</p>";
            $sql->close();
            return;
        }
        $sql->close();
    
        echo "<p>¡$nombreAnimal ($razaAnimal) ha sido añadido al establo $nombreEstablo!</p>";
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
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/zoo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="icon" href="../multimedia/imagenes/favicon.png" />
</head>

<body>
<header>
        <h1>Escritorio Virtual</h1>
        <nav>
            <a href="../index.html" accesskey="i" tabindex="1">Inicio</a>
            <a href="../sobremi.html" accesskey="s" tabindex="2">Sobre mi</a>
            <a href="../noticias.html" accesskey="n" tabindex="3">Noticias</a>
            <a href="../agenda.html" accesskey="a" tabindex="4">Agenda</a>
            <a href="../meteorologia.html" accesskey="m" tabindex="5">Meteorología</a>
            <a href="../viajes.php" accesskey="v" tabindex="6">Viajes</a>
            <a href="../juegos.html" accesskey="j" tabindex="7">Juegos</a>
        </nav>
    </header>

    <section>
        <h2>Lista de juegos</h2>
        <ul>
            <li><a href="../memoria.html" accesskey="u" tabindex="8">Juego de memoria</a></li>
            <li><a href="../sudoku.html" accesskey="d" tabindex="9">Sudoku</a></li>
            <li><a href="../crucigrama.php" accesskey="c" tabindex="10">Crucigrama matemático</a></li>
            <li><a href="zoo.php" accesskey="z" tabindex="12">Zoo interactivo</a></li>
        </ul>
    </section>

    <section>
        <h2>Opciones de administrador</h2>
        <form action="#" method="post">
            <label for="preparar">Preparar base de datos</label>
            <input id="preparar" type="submit" name="preparar" value="Preparar base de datos" />
        </form>
        <form action="#" method="post">
            <label for="exportar">Exportar datos</label>
            <input id="exportar" type="submit" name="exportar" value="Exportar datos" />
        </form>

        <form action="#" method="post" enctype="multipart/form-data">
            <label for="importar">Importar datos</label>
            <input id="importar" type="file" name="importar" value="Importar datos" />
            <label for="submit">Importar datos</label>
            <input id="submit" type="submit" name="submit" value="Importar datos" />
        </form>    
    </section>

    <section>
        <h2>Información del zoo</h2>
        <form action="#" method="post">
            <label for="informacion">Para ver la información asociada a animales y cuidadores pulsa aquí</label>
            <input id="informacion" type="submit" name="informacion" value="Estadísticas del Zoo" />
        </form>
    </section>

    <section>
        <h2>¡Da de comer un animal!</h2>
        <form action="#" method="post">
            <label for="idAnimal">ID de animal</label>
            <input id="idAnimal" type="text" name="animal" required/>
            <label for="idCuidadorComer">ID del cuidador</label>
            <input id="idCuidadorComer" type="text" name="cuidadorComer" required/>
            <label for="alimentar">Enviar comida</label>
            <input id="alimentar" type="submit" name="alimentar" value="Alimenta"/>
        </form>
    </section>

    <section>
        <h2>Añade un animal a un establo</h2>
        <form action="#" method="post">
            <label for="nombreAnimal">Nombre del animal</label>
            <input id="nombreAnimal" type="text" name="nombreAnimal" required/>
            <label for="razaAnimal">Raza del animal</label>
            <input id="razaAnimal" type="text" name="razaAnimal" required/>
            <label for="idEstablo">ID del establo</label>
            <input id="idEstablo" type="text" name="establo" required/>
            <label for="idCuidadorAñadir">ID del cuidador</label>
            <input id="idCuidadorAñadir" type="text" name="cuidadorAñadir" required/>
            <label for="añadir">Añadir animal</label>
            <input id="añadir" type="submit" name="añadir" value="Añadir"/>
    </section>

    <?php
    $zoo = new Zoo();

    if (isset($_POST["preparar"])) {
        $zoo->prepararBase();
    }

    if (isset($_POST["exportar"])) {
        $zoo->exportData();
    }

    if (isset($_POST["submit"])) {
        $zoo->importData();
    }

    if (isset($_POST["informacion"])) {
        $zoo->verInformacion();
    }

    if (isset($_POST["alimentar"])) {
        $zoo->alimentarAnimal();
    }

    if (isset($_POST["añadir"])) {
        $zoo->añadirAnimal();
    }
    ?>
</body>



</html>