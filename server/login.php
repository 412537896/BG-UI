<?php
header('content-type:text/plain;charset=utf-8');

$return = array();
$return['referer'] = '/tpl/';
$return['refresh'] = true;
$return['state'] = 'success';
$return['message'] = '�ύ�ɹ�';

echo json_encode($return);