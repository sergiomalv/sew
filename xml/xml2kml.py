import xml.etree.ElementTree as et

# Variables
SCHEMA_URL = '{http://www.uniovi.es}'


def parse_xml(file_name: str) -> et.ElementTree:
    """
    Parse a .xml file into element tree.
    :param file_name: Name of the file
    :return: The element tree
    """
    try:
        tree = et.parse(file_name)
        return tree
    except IOError:
        print(f"{file_name} doesn't found")
        exit()
    except et.ParseError:
        print(f"Error processing {file_name}")
        exit()


def process_xml(tree: et.ElementTree) -> None:
    """
    Given an element tree, saves the coordinates of each route
    :param tree: The element tree
    """
    # Get the root of the tree
    root = tree.getroot()

    counter = 1
    # Access to the routes, get the coordinates and save them
    for child in root.findall(f'{SCHEMA_URL}*'):
        coordinates = get_coordinates(child)
        save_to_kml(f'ruta{counter}.kml', coordinates)
        counter += 1


def get_coordinates(tree: et.Element) -> list[str]:
    """
    Given an element tree, saves the coordinates of the milestones in a list
    :param tree: The element tree
    :return: The list with the coordinates
    """
    coordinates = []

    # Save the coordinates of each milestone
    for coordinate in tree.findall(f'.//{SCHEMA_URL}coordenadas'):
        coordinates.append(f"{coordinate.get('longitud')},{coordinate.get('latitud')},{coordinate.get('altitud')}")

    return coordinates


def save_to_kml(file_name: str, coordinates: list[str]) -> None:
    """
    Given a list of coordinates, save them in a .kml file
    :param file_name: Name of the final file
    :param coordinates: List of coordinates
    """
    with open(file_name, 'w') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
        f.write('<Document>\n')
        f.write('<Placemark>\n')
        f.write(f'<name>{file_name}</name>\n')
        f.write('<LineString>\n')
        f.write('<extrude>1</extrude>\n')
        f.write('<tessellate>1</tessellate>\n')
        f.write('<coordinates>\n')
        for coordinate in coordinates:
            f.write(f'{coordinate}\n')
        f.write('</coordinates>\n')
        f.write('<altitudeMode>relativeToSea</altitudeMode>')
        f.write('</LineString>\n')
        f.write("<Style> id='lineaRoja'")
        f.write('<LineStyle>')
        f.write('<color>#ff0000ff</color>')
        f.write('<width>5</width>')
        f.write('</LineStyle>')
        f.write('</Style>')
        f.write('</Placemark>\n')
        f.write('</Document>\n')
        f.write('</kml>\n')


def main():
    # Parse the xml
    tree = parse_xml("rutasEsquema.xml")

    # Get and save the coordinates of each route
    process_xml(tree)


if __name__ == "__main__":
    main()
