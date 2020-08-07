# -*- coding: utf-8 -*-
"""
Created on Fri Aug  7 03:05:18 2020

This program will take a zipped file from command line and unzip it 

@author: Alex
"""
import sys
from zipfile import ZipFile
import os

try:
    
    arguments = sys.argv[1]
    cwd = os.getcwd()
    complete_path = str(cwd) + "\\" + str(arguments)
    
    print(f"DEBUG: \n \t Attempting to Unzip: {arguments} \n \t Looking in Folder: {cwd} \n \t File Location: {complete_path} \n\n")
    
    
    
    zip_file = ZipFile(complete_path, 'r')
    zip_file.extractall(cwd)
    
    print("File successfully unzipped \n\n")
except:
    print("Unzipping failed!")
    