<?php
$dirname = '../data/listProjects/';
$dir = opendir($dirname);

$tabListProjects = [];
$i = 0;

while($file = readdir($dir))
{
    if($file != '.' && $file != '..' && !is_dir($dirname.$file))
    {
        $tabListProjects[$i] = $file;

        $i++;
    }
}

closedir($dir);

echo json_encode($tabListProjects);