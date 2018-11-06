import os
import sys
import pickle

# Image processing imports
import cv2
import numpy as np
from scipy.stats import itemfreq


IMAGE_DIR = "thumbnails/"
DETAILS_FILENAME = "data/collection-color-details.csv"
COLOR_DELIMITER = "$"

# Turns a list of (BGR) into delimited string of color hexes
def convert_bgr2hex(bgrs):
  hex = [f"#{bgr[2]:02x}{bgr[1]:02x}{bgr[0]:02x}" for bgr in bgrs]
  return COLOR_DELIMITER.join(hex)

# Quantize image into n colors and return those colors as list of (BGR)
def get_dominant_colors(n, img):
  # Convert img into float32 array
  arr = img.reshape((-1,3))
  arr = np.float32(arr)

  # Define k-means hyperparameters
  criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
  flags = cv2.KMEANS_RANDOM_CENTERS
  ret,label,centers = cv2.kmeans(arr, n, None, criteria, 10, flags)

  # Convert back to uint8
  centers = np.uint8(centers)
  return convert_bgr2hex(centers)

# Convert the image into grayscale and return mean value
def get_brightness(img):
  gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
  return f"{gray_img.mean():.4f}"

# Convert the image into grayscale and calculate Michelson contrast
def get_contrast(img):
  # Turn image into float32 array
  gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
  values = np.float32(gray_img.flatten())

  vmin = np.nanmin(values)
  vmax = np.nanmax(values)
  return f"{(vmax - vmin) / (vmax + vmin):.4f}"

'''
  Load the collection, find the thumbnail names,
  and then process the corresponding thumbnail.
  Write this information to DETAILS_FILENAME.
'''

with open('data/wcma-collection.pickle', 'rb') as f:
  collection = pickle.load(f)

with open(DETAILS_FILENAME, 'w+') as color_file:
  for id in collection:
    artwork = collection[id]
    if "filename" in artwork:
      image = cv2.imread(IMAGE_DIR + artwork["filename"])
      if image is not None:
        dominant_colors = get_dominant_colors(3, image)
        brightness = get_brightness(image)
        contrast = get_contrast(image)
        data = f"{id},{dominant_colors},{brightness},{contrast}\n"
        print(data)
        color_file.write(data)
