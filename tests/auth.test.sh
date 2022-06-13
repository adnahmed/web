
set admin_username "admin"
set admin_password "admin_secret"
set first_name "firstName"
set last_name "lastName"

set proctor_username "proctor"
set proctor_password "proctor_secret"

set examinee_username "examinee"
set examinee_password "examinee_secret"

echo " Test 1: Register Administrator "
http POST :3001/register/administrator "username=$admin_username" "password=$admin_password" "first_name=$first_name" "last_name=$last_name"

echo " Test 2: Login Administrator "
set adminToken (http POST :3001/login/administrator "username=$admin_username" "password=$admin_password")
echo "Administrator Token: $adminToken"

echo " Test 3: Register Proctor "
http POST :3001/register/proctor "username=$proctor_username" "password=$proctor_password" "first_name=$first_name" "last_name=$last_name" --auth $adminToken --auth-type bearer 

echo " Test 4: Login Proctor "
set proctorToken (http POST :3001/login/proctor "username=$proctor_username" "password=$proctor_password")
echo "Proctor Token: $proctorToken"

echo " Test 5: Register Examinee"
http POST :3001/register/examinee "username=$examinee_username" "password=$examinee_password" "first_name=$first_name" "last_name=$last_name" --auth-type bearer --auth $adminToken

echo " Test 6: Login Examinee"
set examineeToken (http POST :3001/login/examinee "username=$examinee_username" "password=$examinee_password")
echo "Examinee Token: $examineeToken"
