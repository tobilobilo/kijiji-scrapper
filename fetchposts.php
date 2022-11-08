<?php 
	function Parse ($url) { 
        #$fileContents = file_get_contents($url);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch,CURLOPT_URL, $url);
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.13 (KHTML, like Gecko) Chrome/0.A.B.C Safari/525.13");
        $fileContents = curl_exec($ch);
        curl_close($ch);
        $fileContents = str_replace(array("\n", "\r", "\t"), '', $fileContents);
        $fileContents = str_replace("g-core:price", 'price', $fileContents);
        $fileContents = str_replace("dc:date", 'date', $fileContents);
        $fileContents = str_replace("atom:link", 'feedurl', $fileContents);
        $fileContents = trim(str_replace('"', "'", $fileContents));
        $simpleXml = simplexml_load_string($fileContents);
        $json = json_encode($simpleXml);
        return $json;
    }
    echo Parse(urldecode($_GET['rssurl']));
?>