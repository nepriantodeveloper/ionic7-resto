<?php
$host = "localhost"; /* Host name */
$user = "root"; /* User */
$password = "root"; /* Password */
$dbname = "initsmps_initstor_foodies_php"; /* Database name */

$con = mysqli_connect($host, $user, $password,$dbname);
// Check connection
if (!$con) {
 die("Connection failed: " . mysqli_connect_error());
}