<?php
/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Drivers;
use App\Models\Settings;
use App\Models\General;
use App\Models\Otp;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Hashing\BcryptHasher;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use JWTAuth;
use Validator;
use DB;

class DriversController extends Controller
{
    public function getAll(){
        $data = DB::table('drivers')
                ->select('drivers.*','cities.name as city_name')
                ->join('cities','drivers.city','cities.id')
                ->get();
        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function create_driver_account(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required',
            'first_name'=>'required',
            'last_name'=>'required',
            'mobile'=>'required',
            'country_code'=>'required',
            'password' => 'required',
            'cover' => 'required',
            'gender' => 'required',
            'city' => 'required',
            'address' => 'required',
            'lat' => 'required',
            'lng' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 500);
        }
        $emailValidation = Drivers::where('email',$request->email)->first();
        if (is_null($emailValidation) || !$emailValidation) {

            $matchThese = ['country_code' => $request->country_code, 'mobile' => $request->mobile];
            $data = Drivers::where($matchThese)->first();
            if (is_null($data) || !$data) {
                $user = Drivers::create([
                    'email' => $request->email,
                    'first_name'=>$request->first_name,
                    'last_name'=>$request->last_name,
                    'status'=>1,
                    'mobile'=>$request->mobile,
                    'cover'=>$request->cover,
                    'country_code'=>$request->country_code,
                    'gender'=>$request->gender,
                    'city'=>$request->city,
                    'address'=>$request->address,
                    'current'=>'active',
                    'lat'=>$request->lat,
                    'lng'=>$request->lng,
                    'password' => Hash::make($request->password),
                ]);

                $token = JWTAuth::fromUser($user);
                $inviter = Drivers::where('id',$user->id)->first();
                $inviter->deposit(0);
                return response()->json(['user'=>$user,'token'=>$token,'status'=>200], 200);
            }

            $response = [
                'success' => false,
                'message' => 'Mobile is already registered.',
                'status' => 500
            ];
            return response()->json($response, 500);
        }
        $response = [
            'success' => false,
            'message' => 'Email is already taken',
            'status' => 500
        ];
        return response()->json($response, 500);
    }

    public function importData(Request $request){
        $request->validate([
            "csv_file" => "required",
        ]);
        $file = $request->file("csv_file");
        $csvData = file_get_contents($file);
        $rows = array_map("str_getcsv", explode("\n", $csvData));
        $header = array_shift($rows);
        foreach ($rows as $row) {
            if (isset($row[0])) {
                if ($row[0] != "") {

                    if(count($header) == count($row)){
                        $row = array_combine($header, $row);
                        $insertInfo =  array(
                            'id' => $row['id'],
                            'first_name' => $row['first_name'],
                            'last_name' => $row['last_name'],
                            'email' => $row['email'],
                            'password' => $row['password'],
                            'gender' => $row['gender'],
                            'status' => $row['status'],
                            'lat' => $row['lat'],
                            'lng' => $row['lng'],
                            'cover' => $row['cover'],
                            'country_code' => $row['country_code'],
                            'mobile' => $row['mobile'],
                            'verified' => 1,
                            'fcm_token' => $row['fcm_token'],
                            'others' => $row['others'],
                            'date' => $row['date'],
                            'extra_field' => $row['extra_field'],
                            'current' => $row['current'],
                            'city'=>$row['city'],
                            'address'=>$row['address'],
                        );
                        $checkLead  =  Drivers::where("id", "=", $row["id"])->first();
                        if (!is_null($checkLead)) {
                            DB::table('drivers')->where("id", "=", $row["id"])->update($insertInfo);
                            $inviter = Drivers::where('id',$row["id"])->first();
                            $inviter->deposit(0);
                        }
                        else {
                            DB::table('drivers')->insert($insertInfo);
                            $inviter = Drivers::where('id',$insertInfo["id"])->first();
                            $inviter->deposit(0);
                        }
                    }
                }
            }
        }
        $response = [
            'data'=>'Done',
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function update(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $data = Drivers::find($request->id)->update($request->all());

        if (is_null($data)) {
            $response = [
                'success' => false,
                'message' => 'Data not found.',
                'status' => 404
            ];
            return response()->json($response, 404);
        }
        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function getById(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $data = Drivers::find($request->id);

        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function getNearMe(Request $request){
        $validator = Validator::make($request->all(), [
            'lat' => 'required',
            'lng' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $searchQuery = Settings::select('allowDistance','searchResultKind')->first();

        if($searchQuery->searchResultKind == 1){
            $values = 3959; // miles
            $distanceType = 'miles';
        }else{
            $values = 6371; // km
            $distanceType = 'km';
        }
        \DB::enableQueryLog();
        $data = Drivers::select(DB::raw('drivers.*, ( '.$values.' * acos( cos( radians('.$request->lat.') ) * cos( radians( lat ) ) * cos( radians( lng ) - radians('.$request->lng.') ) + sin( radians('.$request->lat.') ) * sin( radians( lat ) ) ) ) AS distance'))
        ->having('distance', '<', (int)$searchQuery->allowDistance)
        ->orderBy('distance')
        ->where(['drivers.status'=>1,'drivers.current'=>'active'])
        ->get();

        foreach($data as $loop){
            $loop->distance = round($loop->distance,2);
        }
        $response = [
            'data'=>$data,
            'distanceType'=>$distanceType,
            'success' => true,
            'status' => 200,
            'havedata'=>true,
        ];
        return response()->json($response, 200);
    }

    public function login(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required',
            'password' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 500);
        }
        $user = Drivers::where('email', $request->email)->first();
        if(!$user) return response()->json(['error' => 'User not found.'], 500);
        if (!(new BcryptHasher)->check($request->input('password'), $user->password)) {
            return response()->json(['error' => 'Email or password is incorrect. Authentication failed.'], 401);
        }
        $credentials = $request->only('email', 'password');
        try {
            $token = JWTAuth::fromUser($user);
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        return response()->json(['user' => $user,'token'=>$token,'status'=>200], 200);
    }

    public function verifyEmailForReset(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $matchThese = ['email' => $request->email];

        $user = Drivers::where($matchThese)->first();

        if(!$user) return response()->json(['data'=>false,'error' => 'User not found.'], 500);

        $settings = General::take(1)->first();
        $mail = $request->email;
        $username = $request->email;
        $subject = 'Reset Password';
        $otp = random_int(100000, 999999);
        $savedOTP = Otp::create([
            'otp'=>$otp,
            'email'=>$request->email,
            'status'=>0,
        ]);
        $mailTo = Mail::send('mails/reset',
            [
                'app_name'      =>$settings->name,
                'otp'          => $otp
            ]
            , function($message) use($mail,$username,$subject,$settings){
            $message->to($mail, $username)
            ->subject($subject);
            $message->from($settings->email,$settings->name);
        });

        $response = [
            'data'=>true,
            'mail'=>$mailTo,
            'otp_id'=>$savedOTP->id,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);

    }

    public function updateUserPasswordWithEmailDriver(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required',
            'password' => 'required',
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $match =  ['email'=>$request->email,'id'=>$request->id];
        $data = Otp::where($match)->first();
        if (is_null($data)) {
            $response = [
                'success' => false,
                'message' => 'Data not found.',
                'status' => 404
            ];
            return response()->json($response, 404);
        }

        $updates = Drivers::where('email',$request->email)->first();
        $updates->update(['password'=>Hash::make($request->password)]);

        if (is_null($updates)) {
            $response = [
                'success' => false,
                'message' => 'Data not found.',
                'status' => 404
            ];
            return response()->json($response, 404);
        }

        $response = [
            'data'=>true,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function verifyPhone(Request $request){
        $validator = Validator::make($request->all(), [
            'country_code'=>'required',
            'mobile'=>'required'
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $matchThese = ['country_code' => $request->country_code, 'mobile' => $request->mobile];
        $data= Drivers::where($matchThese)->first();
        if (is_null($data)) {
            return response()->json(['error' => 'User not found.'], 500);
        }

        $settings = Settings::take(1)->first();
        if($settings->sms_name =='0'){ // send with twillo
            $payCreds = DB::table('settings')
            ->select('*')->first();
            if (is_null($payCreds) || is_null($payCreds->sms_creds)) {
                $response = [
                    'success' => false,
                    'message' => 'sms gateway issue please contact administrator',
                    'status' => 404
                ];
                return response()->json($response, 404);
            }
            $credsData = json_decode($payCreds->sms_creds);
            if(is_null($credsData) || is_null($credsData->twilloCreds) || is_null($credsData->twilloCreds->sid)){
                $response = [
                    'success' => false,
                    'message' => 'sms gateway issue please contact administrator',
                    'status' => 404
                ];
                return response()->json($response, 404);
            }

            $id = $credsData->twilloCreds->sid;
            $token = $credsData->twilloCreds->token;
            $url = "https://api.twilio.com/2010-04-01/Accounts/$id/Messages.json";
            $from = $credsData->twilloCreds->from;
            $to = $request->country_code.$request->mobile; // twilio trial verified number
            try{
                $otp = random_int(100000, 999999);
                $client = new \GuzzleHttp\Client();
                $response = $client->request('POST', $url, [
                    'headers' =>
                    [
                        'Accept' => 'application/json',
                        'Content-Type' => 'application/x-www-form-urlencoded',
                    ],
                    'form_params' => [
                    'Body' => 'Your Verification code is : '.$otp, //set message body
                    'To' => $to,
                    'From' => $from //we get this number from twilio
                    ],
                    'auth' => [$id, $token, 'basic']
                    ]
                );
                $savedOTP = Otp::create([
                    'otp'=>$otp,
                    'email'=>$to,
                    'status'=>0,
                ]);
                $response = [
                    'data'=>true,
                    'otp_id'=>$savedOTP->id,
                    'success' => true,
                    'status' => 200,
                ];
                return response()->json($response, 200);
            }catch (Exception $e){
                echo "Error: " . $e->getMessage();
            }

        }else{ // send with msg91
            $payCreds = DB::table('settings')
            ->select('*')->first();
            if (is_null($payCreds) || is_null($payCreds->sms_creds)) {
                $response = [
                    'success' => false,
                    'message' => 'sms gateway issue please contact administrator',
                    'status' => 404
                ];
                return response()->json($response, 404);
            }
            $credsData = json_decode($payCreds->sms_creds);
            if(is_null($credsData) || is_null($credsData->msg) || is_null($credsData->msg->key)){
                $response = [
                    'success' => false,
                    'message' => 'sms gateway issue please contact administrator',
                    'status' => 404
                ];
                return response()->json($response, 404);
            }
            $clientId = $credsData->msg->key;
            $smsSender = $credsData->msg->sender;
            $otp = random_int(100000, 999999);
            $client = new \GuzzleHttp\Client();
            $to = $request->country_code.$request->mobile;
            $res = $client->get('http://api.msg91.com/api/sendotp.php?authkey='.$clientId.'&message=Your Verification code is : '.$otp.'&mobile='.$to.'&sender='.$smsSender.'&otp='.$otp);
            $data = json_decode($res->getBody()->getContents());
            $savedOTP = Otp::create([
                'otp'=>$otp,
                'email'=>$to,
                'status'=>0,
            ]);
            $response = [
                'data'=>true,
                'otp_id'=>$savedOTP->id,
                'success' => true,
                'status' => 200,
            ];
            return response()->json($response, 200);
        }
    }

    public function updateUserPasswordWithPhoneDriver(Request $request){
        $validator = Validator::make($request->all(), [
            'country_code' => 'required',
            'mobile' => 'required',
            'password' => 'required',
            'id' => 'required',
            'otp_content' => 'required'
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $match =  ['email'=>$request->otp_content,'id'=>$request->id];
        $data = Otp::where($match)->first();
        if (is_null($data)) {
            $response = [
                'success' => false,
                'message' => 'Data not found.',
                'status' => 404
            ];
            return response()->json($response, 404);
        }

        $updates =  Drivers::where(['country_code' => $request->country_code, 'mobile' => $request->mobile])->first();
        $updates->update(['password'=>Hash::make($request->password)]);

        if (is_null($updates)) {
            $response = [
                'success' => false,
                'message' => 'Data not found.',
                'status' => 404
            ];
            return response()->json($response, 404);
        }

        $response = [
            'data'=>true,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function verifyPhoneForFirebase(Request $request){
        $validator = Validator::make($request->all(), [
            'mobile' => 'required',
            'country_code'=>'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $matchThese = ['country_code' => $request->country_code, 'mobile' => $request->mobile];

        $user = Drivers::where($matchThese)->first();

        if(!$user) return response()->json(['data'=>false,'error' => 'User not found.'], 500);
        $response = [
            'data'=>true,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function updateUserPasswordWithPhoneFirebaseDriver(Request $request){
        $validator = Validator::make($request->all(), [
            'country_code' => 'required',
            'mobile' => 'required',
            'password' => 'required',
            'otp_content' => 'required'
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $updates =  Drivers::where(['country_code' => $request->country_code, 'mobile' => $request->mobile])->first();
        $updates->update(['password'=>Hash::make($request->password)]);

        if (is_null($updates)) {
            $response = [
                'success' => false,
                'message' => 'Data not found.',
                'status' => 404
            ];
            return response()->json($response, 404);
        }

        $response = [
            'data'=>true,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function loginWithPhonePassword(Request $request){
        $validator = Validator::make($request->all(), [
            'mobile' => 'required',
            'country_code'=>'required',
            'password'=>'required'
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $matchThese = ['country_code' => $request->country_code, 'mobile' => $request->mobile];
        $user = Drivers::where($matchThese)->first();
        if(!$user) return response()->json(['error' => 'User not found.'], 500);
        if (!(new BcryptHasher)->check($request->input('password'), $user->password)) {
            return response()->json(['error' => 'Phone Number or password is incorrect. Authentication failed.'], 401);
        }
        $credentials = $request->only('country_code','mobile', 'password');
        try {
            $token = JWTAuth::fromUser($user);
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        return response()->json(['user' => $user,'token'=>$token,'status'=>200], 200);
    }

    public function loginWithMobileOtp(Request $request){
        $validator = Validator::make($request->all(), [
            'mobile' => 'required',
            'country_code'=>'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $matchThese = ['country_code' => $request->country_code, 'mobile' => $request->mobile];
        $user = Drivers::where($matchThese)->first();
        if(!$user) return response()->json(['error' => 'User not found.'], 500);
        try {
            JWTAuth::factory()->setTTL(40320); // Expired Time 28days
            if (! $token = JWTAuth::fromUser($user, ['exp' => Carbon::now()->addDays(28)->timestamp])) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        return response()->json(['user' => $user,'token'=>$token,'status'=>200], 200);
    }

    public function logout(){
        // Invalidate current logged user token
        auth()->logout();

        // Return message
        return response()
            ->json(['message' => 'Successfully logged out']);
    }
}
