from PIL import Image


def remove_alpha(image: Image.Image, bg_colour=(255, 255, 255)):
    png = image.convert('RGBA')
    background = Image.new('RGBA', png.size, bg_colour)
    alpha_composite =  Image.alpha_composite(background, png)

    new_image = alpha_composite.convert('RGB')

    return new_image
