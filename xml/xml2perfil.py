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
    Given an element tree, saves the altitudes of each route
    :param tree: The element tree
    """
    # Get the root of the tree
    root = tree.getroot()

    counter = 1
    # Access to the routes, get the altitudes and distances and save them
    for child in root.findall(f'{SCHEMA_URL}*'):
        altitudes, distances = get_data(child)
        save_to_svg(f'perfil{counter}.svg', altitudes, distances)
        counter += 1


def get_data(tree: et.Element) -> tuple[list[int], list[int]]:
    """
    Given an element tree, saves the altitudes and distances of the milestones in a list
    :param tree: The element tree
    :return: The list with the coordinates
    """
    altitudes = []
    distances = []

    # Save the altitudes of each milestone
    for coordinate in tree.findall(f'.//{SCHEMA_URL}coordenadas'):
        altitudes.append(int(coordinate.get('altitud')))

    # Save the distances of each milestone
    for distance in tree.findall(f'.//{SCHEMA_URL}distancia'):
        distances.append(int(distance.text))

    return altitudes, distances


def save_to_svg(file_name: str, altitudes: list[int], distances: list[int]) -> None:
    """
    Given a list of altitudes, save them in a .svg file
    :param file_name: Name of the final file
    :param altitudes: List of coordinates
    """
    # Get the highest altitude
    max_altitude = max(altitudes) + 20

    with open(file_name, "w") as file:
        file.write('<?xml version="1.0" encoding="UTF-8" ?>\n')
        file.write(f'<svg width="auto" height="{max_altitude + 30}" xmlns="http://www.w3.org/2000/svg" version="2.0">')
        file.write('<polyline points="\n')

        # Initial point
        x = 10
        file.write(f"10, {max_altitude}\n")
        counter = 0
        for altitude in altitudes:
            if counter != 0:
                x += distances[counter -1]
                file.write(f"{x}, {max_altitude - altitude}\n")
            else:
                file.write(f"{x}, {max_altitude - altitude}\n")
            counter += 1

        file.write(f"{x}, {max_altitude}\n")
        file.write(f"10, {max_altitude}")

        file.write('" style="fill:white;stroke:red;stroke-width:4" />\n')
        file.write('</svg>\n')


def main():
    # Parse the xml
    tree = parse_xml("rutasEsquema.xml")

    # Get and save the altitudes of each route
    process_xml(tree)


if __name__ == "__main__":
    main()
