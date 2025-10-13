import{ac as G,ad as H,ae as U,af as V,ag as W,ah as v,ai as I,r as j,aj as F,D as e,F as d,ak as A,Z as M,al as E,$ as J,X as Y,Y as K}from"./index-DJm73Gd8.js";import{z as n}from"./index-DXqQCM1T.js";import{u as L,F as c}from"./fields-DRFNYTBH.js";import{F as P,t as T}from"./form-provider-Bv2QLm_X.js";import{A as O}from"./AuthService-foVeZrRB.js";import{M as w}from"./MemberService-CCBPPnBE.js";import"./ko-DBbRYMOz.js";import"./image-DPed605N.js";import{F as D,S as X}from"./sign-up-terms-DbnMw_Ti.js";import{I as N}from"./InputAdornment-B7kdQGsa.js";import{L as S}from"./LoadingButton-8OnUjDzw.js";const Z=async({email:i,password:g,firstName:l,lastName:o})=>{const u={email:i,password:g,firstName:l,lastName:o};try{const r=await G.post(H.auth.signUp,u),{accessToken:a}=r.data;if(!a)throw new Error("Access token not found in response");sessionStorage.setItem(U,a)}catch(r){throw console.error("Error during sign up:",r),r}},Q=n.object({admin_id:n.string().min(1,{message:"아이디를 입력해주세요!"}),password:n.string().min(1,{message:"비밀번호를 입력해주세요!"}).min(6,{message:"비밀번호는 최소 6자 이상입력해주세요!"})});function ge(){const{setAuthenticated:i,setAdmin:g}=V(),l=W();v(),I();const[o,u]=j.useState(""),[r,a]=j.useState(""),f=F(),x={email:"",admin_id:"",password:""},h=L({resolver:T(Q),defaultValues:x}),{handleSubmit:y,formState:{isSubmitting:m}}=h,p=y(async t=>{try{if(!o||o.length!==6){alert("올바른 인증번호를 입력해주세요.");return}const s=await w.verificateMail("classictalk@naver.com",o);s&&s.length>0&&s[0].id?(await w.certifyMail(s[0]),O.login(t.admin_id,t.password).then(b=>{b.type!=="success"?a(b.message):(g(b.admin),i(!0),a(""),l("/"))})):alert("올바른 인증번호를 입력해주세요.")}catch(s){console.error(s),a(typeof s=="string"?s:s.message)}}),C=async()=>{alert(`메일이 발송 되었습니다. 
인증 메일을 확인해주세요.`);const t=new Date,s=t.getFullYear(),b=String(t.getMonth()+1).padStart(2,"0"),$=String(t.getDate()).padStart(2,"0"),_=String(t.getHours()).padStart(2,"0"),R=String(t.getMinutes()).padStart(2,"0"),q=String(t.getSeconds()).padStart(2,"0"),B=`${s}년 ${b}월 ${$}일 ${_}:${R}:${q}`;new Date(t).setMinutes(t.getMinutes()+10);const k=Math.floor(Math.random()*9e5)+1e5;await w.sendEmail({email:"classictalk@naver.com",subject:"[탬버린뮤직] 관리자 로그인 인증번호 입니다.",type:"관리자로그인",token:k,content:`<table align="center" width="780px" border="0" cellpadding="0" cellspacing="0">
	<tbody>
	<tr>
		<td style="background:#fff; padding:30px 0 40px 30px; border-top:1px solid #b6b6b6; border-left:1px solid #b6b6b6; border-right:1px solid #b6b6b6; font-family:dotum, sans-serif; line-height:22px; color:#666;">
			 안녕하세요. 탬버린 뮤직 입니다. <br>
			<span style="color:#d00000;">탬버린 뮤직(tamburinmusic.com)</span>의 안전한 이용을 위해 관리자 이메일 인증을 진행합니다. <br>
			<br>
			아래 인증번호를 <span style="color:#f26522;font-weight:bold">입력하여</span> 인증을 완료해 주세요. <br>
			개인정보보호를 위해 발송된 <span style="color:#f26522;font-weight:bold">인증번호는 10분간 유효</span>합니다.
		</td>
	</tr>
	<tr>
		<td style=" background:#fff; padding-left:30px; border-left:1px solid #b6b6b6; border-right:1px solid #b6b6b6;">
			<table width="718" border="0" cellspacing="0" cellpadding="0" summary="인증번호 안내">
			<tbody>
			<tr>
				<td height="3" colspan="2" style="background:#333;">
				</td>
			</tr>
			<tr>
				<td align="center" width="150" height="38" style="background:#f7f7f7;font-family:dotum, sans-serif; font-size:12px; color:#111; font-weight:bold">
					인증번호
				</td>
				<td style="padding-left:20px; font-family:dotum, sans-serif; font-size:15px; color:#111; font-weight:bold">
					${k}
				</td>
			</tr>
			<tr>
				<td height="1" colspan="2" style="background:#d2d2d2;">
				</td>
			</tr>
			<tr>
				<td align="center" height="38" style="background:#f7f7f7;font-family:dotum, sans-serif; font-size:12px; color:#111;font-weight:bold">
					발급시간
				</td>
				<td style="padding-left:20px; font-family:dotum, sans-serif; font-size:12px; color:#d00000;font-weight:bold">
					${B}
				</td>
			</tr>
			<tr>
				<td height="2" colspan="2" style="background:#d2d2d2;">
				</td>
			</tr>
			</tbody>
			</table>
		</td>
	</tr>
	<tr>
		<td style="background:#fff; padding:40px 0 20px 30px; border-left:1px solid #b6b6b6; border-right:1px solid #b6b6b6;border-bottom:1px solid #b6b6b6;  font-family:dotum, sans-serif; font-size:11px; color:#333; line-height:22px; ">
			 본 메일은 발신전용으로 회신되지 않습니다. 
		</td>
	</tr>
	</tbody>
	<!--footer-->
	</table>`})},z=e.jsxs(d,{gap:3,display:"flex",flexDirection:"column",children:[e.jsx(c.Text,{name:"admin_id",label:"ID",InputLabelProps:{shrink:!0}}),e.jsx(d,{gap:1.5,display:"flex",flexDirection:"column",children:e.jsx(c.Text,{name:"password",label:"Password",placeholder:"6+ characters",type:f.value?"text":"password",InputLabelProps:{shrink:!0},InputProps:{endAdornment:e.jsx(N,{position:"end",children:e.jsx(A,{onClick:f.onToggle,edge:"end",children:e.jsx(M,{icon:f.value?"solar:eye-bold":"solar:eye-closed-bold"})})})}})}),e.jsxs(d,{gap:1.5,display:"flex",flexDirection:"row",children:[e.jsx(c.Text,{name:"auth_code",label:"인증 번호",InputLabelProps:{shrink:!0},onChange:t=>u(t.target.value)}),e.jsx(S,{fullWidth:!0,color:"inherit",size:"large",type:"button",variant:"contained",onClick:C,children:"인증번호 발송"})]}),e.jsx(S,{fullWidth:!0,color:"inherit",size:"large",type:"submit",variant:"contained",loading:m,loadingIndicator:"로그인 중입니다...",children:"로그인"})]});return e.jsx(e.Fragment,{children:e.jsx(d,{sx:{marginTop:"-10vh",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",bgcolor:"background.default"},children:e.jsxs(d,{sx:{maxWidth:400,width:"100%",margin:"0 auto",padding:{xs:3,md:4},borderRadius:2,bgcolor:"background.paper",boxShadow:t=>t.shadows[24]},children:[e.jsx(D,{title:"로그인을 해주세요.",description:null,sx:{textAlign:{xs:"center",md:"left"}}}),!!r&&e.jsx(E,{severity:"error",sx:{mb:3},children:r}),e.jsx(P,{methods:h,onSubmit:p,children:z})]})})})}const ee=n.object({firstName:n.string().min(1,{message:"First name is required!"}),lastName:n.string().min(1,{message:"Last name is required!"}),email:n.string().min(1,{message:"Email is required!"}).email({message:"Email must be a valid email address!"}),password:n.string().min(1,{message:"Password is required!"}).min(6,{message:"Password must be at least 6 characters!"})});function ue(){const{checkUserSession:i}=I(),g=v(),l=F(),[o,u]=j.useState(""),r={firstName:"Hello",lastName:"Friend",email:"hello@gmail.com",password:"@demo1"},a=L({resolver:T(ee),defaultValues:r}),{handleSubmit:f,formState:{isSubmitting:x}}=a,h=f(async m=>{try{await Z({email:m.email,password:m.password,firstName:m.firstName,lastName:m.lastName}),await(i==null?void 0:i()),g.refresh()}catch(p){console.error(p),u(typeof p=="string"?p:p.message)}}),y=e.jsxs(d,{gap:3,display:"flex",flexDirection:"column",children:[e.jsxs(d,{display:"flex",gap:{xs:3,sm:2},flexDirection:{xs:"column",sm:"row"},children:[e.jsx(c.Text,{name:"firstName",label:"First name",InputLabelProps:{shrink:!0}}),e.jsx(c.Text,{name:"lastName",label:"Last name",InputLabelProps:{shrink:!0}})]}),e.jsx(c.Text,{name:"email",label:"Email address",InputLabelProps:{shrink:!0}}),e.jsx(c.Text,{name:"password",label:"Password",placeholder:"6+ characters",type:l.value?"text":"password",InputLabelProps:{shrink:!0},InputProps:{endAdornment:e.jsx(N,{position:"end",children:e.jsx(A,{onClick:l.onToggle,edge:"end",children:e.jsx(M,{icon:l.value?"solar:eye-bold":"solar:eye-closed-bold"})})})}}),e.jsx(S,{fullWidth:!0,color:"inherit",size:"large",type:"submit",variant:"contained",loading:x,loadingIndicator:"Create account...",children:"Create account"})]});return e.jsxs(e.Fragment,{children:[e.jsx(D,{title:"Get started absolutely free",description:e.jsxs(e.Fragment,{children:["Already have an account? ",e.jsx(J,{component:Y,href:K.auth.jwt.signIn,variant:"subtitle2",children:"Get started"})]}),sx:{textAlign:{xs:"center",md:"left"}}}),!!o&&e.jsx(E,{severity:"error",sx:{mb:3},children:o}),e.jsx(P,{methods:a,onSubmit:h,children:y}),e.jsx(X,{})]})}export{ge as J,ue as a};
