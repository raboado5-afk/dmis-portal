import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link, Redirect, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import {
  ArrowRight, BookOpen, ChevronRight, CircleHelp, FileText,
  GraduationCap, Home, MapPin, Menu, Phone, Search, ShieldCheck,
  Users, Wallet, X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { firebaseConfigured } from '@/lib/firebase';
import {
  createStudentRecord,
  deleteStudentRecord,
  submitAdmissionApplication,
  useSchoolCollection,
} from '@/lib/school-data';

const queryClient = new QueryClient();

const siteLinks = [
  ['Home', '/'], ['About', '/about'], ['Admissions', '/admissions'], ['Contact', '/contact'],
];
const portalLinks = [
  { label: 'Students', href: '/portal/students', icon: Users },
  { label: 'Teachers', href: '/portal/teachers', icon: GraduationCap },
  { label: 'Academics', href: '/portal/academics', icon: BookOpen },
  { label: 'Results', href: '/portal/results', icon: FileText },
  { label: 'Fees', href: '/portal/fees', icon: Wallet },
];

function Brand() {
  return <Link href="/" className="brand" aria-label="Darul Muttaqeen home">
    <span className="brand-mark">DM</span><span><span className="brand-title">Darul Muttaqeen</span><span className="brand-sub">INTERNATIONAL SCHOOL</span></span>
  </Link>;
}

function PublicShell({ children }: { children: ReactNode }) {
  const [path] = useLocation();
  const [menu, setMenu] = useState(false);
  return <div className="public-shell">
    <div className="topline"><div className="wrap topline-inner"><span>Rooted in community. Growing through learning.</span><span>Samaru, Gusau · <a href="tel:08105065627">08105065627</a></span></div></div>
    <header className="navbar"><div className="wrap nav-inner">
      <Brand />
      <button className="mobile-toggle" onClick={() => setMenu(!menu)} aria-label={menu ? 'Close navigation' : 'Open navigation'} data-testid="button-mobile-navigation">{menu ? <X size={21}/> : <Menu size={21}/>}</button>
      <nav className={`nav-links ${menu ? 'open' : ''}`} aria-label="Main navigation">
        {siteLinks.map(([name, href]) => <Link key={href} href={href} className={path === href ? 'active' : ''} onClick={() => setMenu(false)}>{name}</Link>)}
        {portalLinks.map(item => <Link key={item.href} href={item.href} onClick={() => setMenu(false)}>{item.label}</Link>)}
      </nav>
      <div className="nav-actions"><Link href="/login" className="btn btn-primary">Staff sign in <ArrowRight size={14}/></Link></div>
    </div></header>
    {children}
    <Footer />
  </div>;
}

function Footer() {
  return <footer className="footer"><div className="wrap">
    <div className="footer-grid">
      <div><Brand/><p>A community-rooted school in Samaru, Gusau. Learn more about Darul Muttaqeen International School and connect with our team.</p></div>
      <div><h4>Explore</h4><div className="footer-links">{siteLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div></div>
      <div><h4>Visit or call</h4><p>Samaru area, behind NEPA Office,<br/>Gusau, Zamfara State, Nigeria</p><a href="tel:08105065627">08105065627</a></div>
    </div>
    <div className="footer-bottom"><span>Darul Muttaqeen International School</span><span>School information and staff tools</span></div>
  </div></footer>;
}

function HomePage() {
  return <PublicShell><main>
    <section className="hero"><div className="wrap hero-grid">
      <div><div className="eyebrow">A place to learn and belong</div><h1>Knowledge for a life of <span>purpose.</span></h1>
        <p className="hero-copy">Darul Muttaqeen International School is part of the Samaru community in Gusau. We are here to support families as they seek a thoughtful, grounded education for their children.</p>
        <div className="hero-ctas"><Link href="/admissions" className="btn btn-gold">Ask about admission <ArrowRight size={15}/></Link><Link href="/about" className="btn btn-outline" style={{borderColor:'#71917b',color:'#f7f2df'}}>Discover DMIS</Link></div>
        <div className="hero-note"><ShieldCheck size={15}/> A school community in Samaru, Gusau</div>
      </div>
      <div className="hero-visual" aria-label="DMIS emblem"><div className="hero-arch"/><div className="seal-orbit"/><div className="hero-seal"><div><strong>DM</strong><span>LEARN · GROW · SERVE</span></div></div><div className="hero-quote">“A strong foundation begins with care, curiosity and community.”<small>OUR SCHOOL SPIRIT</small></div></div>
    </div></section>
    <section className="section"><div className="wrap intro-grid">
      <div><div className="section-kicker">Welcome to DMIS</div><h2>Learning with roots in our community.</h2><p style={{color:'#68756a',fontSize:14,lineHeight:1.75}}>Every family deserves a clear way to understand a school and take the next step. This site introduces our school and offers a simple channel for admission enquiries.</p><Link href="/about" className="btn btn-quiet" style={{marginTop:12}}>About our school <ChevronRight size={15}/></Link></div>
      <div><div className="intro-aside">Education is more than a classroom. It is the confidence to ask, the discipline to practice and the kindness to contribute.</div><div className="values-grid">
        {[['01','A grounded start','Building habits of learning, respect and responsibility.'],['02','Room to grow','Encouraging steady progress and a sense of possibility.'],['03','Community first','Working in partnership with families in Samaru and Gusau.']].map(([n,title,text])=><article className="value-card" key={n}><span className="value-num">{n} / DMIS</span><h3>{title}</h3><p>{text}</p></article>)}
      </div></div>
    </div></section>
    <section className="band"><div className="wrap band-inner"><div><div className="section-kicker">Your next step</div><h2>Have a question about joining the school?</h2><p>Send an admission enquiry or speak with us directly. Online registration here is a demonstration only.</p></div><Link href="/admissions" className="btn btn-primary">View admissions <ArrowRight size={15}/></Link></div></section>
    <section className="section" style={{paddingBlock:65}}><div className="wrap" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:28,flexWrap:'wrap'}}><div><div className="section-kicker">Find us in Gusau</div><h2 style={{marginBottom:6}}>A local school, close to home.</h2><p style={{color:'#68756a',fontSize:13}}>Samaru area, behind NEPA Office, Gusau, Zamfara State.</p></div><Link href="/contact" className="btn btn-outline">Contact the school <ChevronRight size={15}/></Link></div></section>
  </main></PublicShell>;
}

function PageBanner({ kicker, title, description }: { kicker: string; title: string; description: string }) {
  return <section className="page-banner"><div className="wrap"><div className="crumb">{kicker}</div><h1>{title}</h1><p>{description}</p></div></section>;
}

function AboutPage() {
  return <PublicShell><main><PageBanner kicker="Our school" title="A shared commitment to learning." description="A brief introduction to Darul Muttaqeen International School and the values that guide our work with families."/>
    <section className="content-section"><div className="wrap">
      <div className="demo-callout" style={{marginBottom:22}}><strong>Draft copy for review.</strong> The mission, vision and objectives below are proposed website wording and should be confirmed by the school before publication.</div>
      <div className="about-grid">
        <article className="about-panel"><span className="draft-tag">Draft — review before publishing</span><h2>Our mission</h2><p>To nurture purposeful learning, good character and a spirit of service in partnership with families and the wider community.</p></article>
        <article className="about-panel"><span className="draft-tag">Draft — review before publishing</span><h2>Our vision</h2><p>To be a trusted community school where every learner is encouraged to grow in knowledge, confidence and responsibility.</p></article>
        <article className="about-panel" style={{gridColumn:'1/-1'}}><span className="draft-tag">Draft — review before publishing</span><h2>Our objectives</h2><ul><li>Encourage curiosity, steady effort and a love of learning.</li><li>Support learners to practice respect, care and responsibility.</li><li>Build constructive relationships between school and families.</li></ul></article>
      </div>
      <div style={{marginTop:24,display:'flex',justifyContent:'space-between',alignItems:'center',gap:20,flexWrap:'wrap'}}><p className="hint">These statements are illustrative draft copy, not verified official school policy.</p><Link href="/contact" className="btn btn-primary">Talk with us <ArrowRight size={15}/></Link></div>
    </div></section></main></PublicShell>;
}

function AdmissionsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const data = new FormData(e.currentTarget);
    const form = e.currentTarget;
    const missing = ['childName','guardianName','phone','classApplying','email'].filter(k => !String(data.get(k) || '').trim());
    const email = String(data.get('email') || '');
    const phone = String(data.get('phone') || '').replace(/\s/g, '');
    const issues = [...missing.map(() => 'Please complete all required fields.'), ...(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? ['Enter a valid email address.'] : []), ...(phone && !/^[+0-9()-]{7,16}$/.test(phone) ? ['Enter a valid telephone number.'] : [])];
    if (issues.length) { setErrors([...new Set(issues)]); setSubmitted(false); return; }
    setErrors([]);
    if (firebaseConfigured) {
      try {
        await submitAdmissionApplication({
          childName: String(data.get('childName') || '').trim(),
          guardianName: String(data.get('guardianName') || '').trim(),
          phone: String(data.get('phone') || '').trim(),
          email: String(data.get('email') || '').trim(),
          classApplying: String(data.get('classApplying') || ''),
          startTerm: String(data.get('startTerm') || ''),
          notes: String(data.get('notes') || '').trim(),
        });
        setSubmitted(true);
        form.reset();
      } catch {
        setErrors(['The application could not be saved. Please try again or call the school directly.']);
        setSubmitted(false);
      }
    } else {
      setSubmitted(true);
      form.reset();
    }
  }
  return <PublicShell><main><PageBanner kicker="Admissions" title="Start with an enquiry." description={firebaseConfigured ? "Share a few details with the school. Your application will be securely saved for an administrator to review." : "Share a few details and the school team can follow up. This form is a local demonstration and does not send or save an application."}/>
    <section className="content-section"><div className="wrap form-layout">
      <div className="card">{!firebaseConfigured && <div className="demo-callout" style={{marginBottom:22}}>Demo registration only — information entered here stays in this browser session and is not submitted to DMIS.</div>}
        {submitted && <div className="demo-callout" role="status" style={{marginBottom:18}}>{firebaseConfigured ? 'Your application was received. An authorized school administrator can review it in Firestore.' : 'Demo form checked successfully. No application was sent or saved. Please contact the school directly to make an enquiry.'}</div>}
        {errors.length > 0 && <div className="demo-callout" role="alert" style={{marginBottom:16,background:'#f8e9e4',borderColor:'#bd6b51',color:'#784033'}}>{errors.map((e,i)=><div key={i}>{e}</div>)}</div>}
        <form onSubmit={submit} noValidate><div className="field-grid">
          <div className="field"><label htmlFor="childName">Child's full name *</label><input id="childName" name="childName" required autoComplete="name" data-testid="input-child-name"/></div>
          <div className="field"><label htmlFor="guardianName">Parent / guardian name *</label><input id="guardianName" name="guardianName" required data-testid="input-guardian-name"/></div>
          <div className="field"><label htmlFor="phone">Phone number *</label><input id="phone" name="phone" type="tel" required placeholder="e.g. 0810 000 0000" data-testid="input-admission-phone"/></div>
          <div className="field"><label htmlFor="email">Email address *</label><input id="email" name="email" type="email" required placeholder="you@example.com" data-testid="input-admission-email"/></div>
          <div className="field"><label htmlFor="classApplying">Class applying for *</label><select id="classApplying" name="classApplying" required defaultValue="" data-testid="select-class"><option value="" disabled>Select a class</option>{['Nursery','Primary 1','Primary 2','Primary 3','Primary 4','Primary 5','Primary 6'].map(x=><option key={x}>{x}</option>)}</select></div>
          <div className="field"><label htmlFor="startTerm">Preferred start period</label><select id="startTerm" name="startTerm" defaultValue=""><option value="">Choose if known</option><option>To be discussed</option><option>Next available intake</option></select></div>
          <div className="field full"><label htmlFor="notes">Anything you would like us to know?</label><textarea id="notes" name="notes" placeholder="Optional note for the school team"/></div>
        </div><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:15,marginTop:22,flexWrap:'wrap'}}><span className="hint">* Required fields · {firebaseConfigured ? 'Application details are visible to authorized administrators only.' : 'Demo only; no data is transmitted.'}</span><button className="btn btn-primary" type="submit" data-testid="button-submit-admission">{firebaseConfigured ? 'Submit application' : 'Check demo form'} <ArrowRight size={15}/></button></div></form>
      </div>
      <aside className="side-note"><strong>Prefer to speak with someone?</strong>Call the school on <a href="tel:08105065627" style={{fontWeight:700,color:'#1c5236'}}>08105065627</a> or visit us in Samaru, Gusau.<p>Application details and current admission arrangements should be confirmed directly with the school.</p><Link href="/contact" className="btn btn-quiet">Contact details <ChevronRight size={15}/></Link></aside>
    </div></section></main></PublicShell>;
}

function ContactPage() {
  return <PublicShell><main><PageBanner kicker="Contact" title="We are here to help." description="Reach Darul Muttaqeen International School in Samaru, Gusau. For current school information, please contact us directly."/>
    <section className="content-section"><div className="wrap contact-grid">
      <div className="card"><div className="section-kicker">Get in touch</div><h2 style={{font: '700 27px var(--app-font-serif)', color:'#1a432f', margin:'9px 0 8px'}}>Visit or call the school.</h2><p className="hint" style={{fontSize:13,marginBottom:14}}>We welcome enquiries from families and community members.</p>
        <div className="contact-card"><div className="contact-icon"><MapPin size={17}/></div><div><strong>School address</strong><span>Samaru area, behind NEPA Office,<br/>Gusau, Zamfara State, Nigeria</span></div></div>
        <div className="contact-card"><div className="contact-icon"><Phone size={17}/></div><div><strong>Telephone</strong><span><a href="tel:08105065627">08105065627</a></span></div></div>
        <div className="contact-card"><div className="contact-icon"><CircleHelp size={17}/></div><div><strong>Admission enquiries</strong><span>Please call to ask about current arrangements.</span></div></div>
      </div><div className="side-note" style={{padding:28}}><span className="section-kicker">Samaru · Gusau</span><strong style={{fontSize:23,marginTop:12}}>A familiar landmark, a direct conversation.</strong><p>We have not added opening hours or an email address because those details have not been confirmed. Please call before making a visit.</p><a href="tel:08105065627" className="btn btn-primary"><Phone size={15}/> Call 08105065627</a></div>
    </div></section></main></PublicShell>;
}

function LoginPage() {
  const { configured, status, profile, signIn } = useAuth();
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  if (status === 'authorized') return <Redirect to="/portal/students" />;
  async function handleSignIn(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setNotice('');
    setBusy(true);
    try {
      await signIn(String(form.get('email')||'').trim(),String(form.get('password')||''));
    } catch {
      setNotice('Sign-in failed. Check your email and password, then try again.');
    } finally {
      setBusy(false);
    }
  }
  return <PublicShell><main className="login-shell"><div className="login-card">
    <Brand/><h1>Staff sign in</h1><p>For authorized school administrators and teachers.</p>
    {!configured ? <div className="login-alert"><strong>Firebase setup pending.</strong> Sign-in is unavailable until the Firebase project is connected. No credentials will be checked.</div> : status==='unauthorized' ? <div className="login-alert" role="alert"><strong>Staff access required.</strong> This account does not have an approved DMIS staff profile. Ask the administrator to authorize it.</div> : <div className="login-alert"><strong>Authorized staff only.</strong> Sign-in uses Firebase Authentication; access is granted only to approved staff profiles.</div>}
    <form onSubmit={handleSignIn}><div className="field" style={{marginBottom:15}}><label htmlFor="staff-email">Email address</label><input id="staff-email" name="email" type="email" autoComplete="username" placeholder="name@school.example" required disabled={!configured||busy} data-testid="input-staff-email"/></div><div className="field"><label htmlFor="staff-password">Password</label><input id="staff-password" name="password" type="password" autoComplete="current-password" placeholder="Password" required disabled={!configured||busy} data-testid="input-staff-password"/></div><button className="btn btn-primary" type="submit" disabled={!configured||busy} style={{width:'100%',marginTop:20,opacity:(!configured||busy)?0.65:1}} data-testid="button-sign-in">{busy?'Signing in…':'Sign in'} <ArrowRight size={15}/></button></form>
    {notice && <p role="status" className="login-alert">{notice}</p>}
    {profile&&<div className="hint" style={{marginTop:18,textAlign:'center'}}>Signed in as {profile.displayName}.</div>}
    <div className="hint" style={{marginTop:18,textAlign:'center'}}>Need access? Please contact the school administrator.</div>
  </div></main></PublicShell>;
}

type Student = { id:string; name:string; code:string; className:string; classId:string; guardian:string; status:string };
type Teacher = { id:string; name:string; initials:string; subject:string; classes:string[]; status:string };
type ResultRecord = { id:string; student:string; className:string; classId?:string; scores:number[]; subjects?:string[] };
const initialStudents: Student[] = [
  {id:'s1',name:'Amina Yusuf',code:'DEMO-001',className:'Primary 4',classId:'primary-4',guardian:'Hauwa Yusuf',status:'Active'},
  {id:'s2',name:'Sani Bello',code:'DEMO-002',className:'Primary 3',classId:'primary-3',guardian:'Bello Sani',status:'Active'},
  {id:'s3',name:'Maryam Ibrahim',code:'DEMO-003',className:'Primary 5',classId:'primary-5',guardian:'Fatima Ibrahim',status:'Active'},
  {id:'s4',name:'Usman Adamu',code:'DEMO-004',className:'Primary 2',classId:'primary-2',guardian:'A. Adamu',status:'Active'},
];
const teachers: Teacher[] = [
  {id:'t1',name:'Halima Garba',initials:'HG',subject:'English',classes:['Primary 4','Primary 5'],status:'Sample profile'},
  {id:'t2',name:'Abubakar Musa',initials:'AM',subject:'Mathematics',classes:['Primary 3','Primary 4'],status:'Sample profile'},
  {id:'t3',name:'Safiya Lawal',initials:'SL',subject:'Basic Science',classes:['Primary 5','Primary 6'],status:'Sample profile'},
];
const scores = [
  {id:'r1',student:'Amina Yusuf',className:'Primary 4',classId:'primary-4',scores:[82,74,91,68]},
  {id:'r2',student:'Sani Bello',className:'Primary 3',classId:'primary-3',scores:[65,78,70,84]},
  {id:'r3',student:'Maryam Ibrahim',className:'Primary 5',classId:'primary-5',scores:[93,88,79,86]},
];
const subjects = ['English','Mathematics','Basic Science','Social Studies'];
const classGroups = ['Nursery','Primary 1','Primary 2','Primary 3','Primary 4','Primary 5','Primary 6']
  .map((name) => ({ id:name.toLowerCase().replaceAll(' ', '-'), name, subjectCount:6 }));
const subjectRecords = ['English','Mathematics','Basic Science','Social Studies','Creative Arts','Physical Education']
  .map((name) => ({ id:name.toLowerCase().replaceAll(' ', '-'), name, group:'General sample' }));
const initialFees = [
  {id:'f1',name:'Amina Yusuf',className:'Primary 4',classId:'primary-4',amount:50000,paid:35000},
  {id:'f2',name:'Sani Bello',className:'Primary 3',classId:'primary-3',amount:50000,paid:50000},
  {id:'f3',name:'Maryam Ibrahim',className:'Primary 5',classId:'primary-5',amount:50000,paid:20000},
  {id:'f4',name:'Usman Adamu',className:'Primary 2',classId:'primary-2',amount:50000,paid:0},
];

function PortalShell({ children, title }: { children: ReactNode; title:string }) {
  const [path] = useLocation(); const [opened,setOpened] = useState(false);
  const [, setLocation] = useLocation();
  const { configured, profile, signOut } = useAuth();
  return <div className="portal-layout">
    {opened && <button onClick={()=>setOpened(false)} aria-label="Close menu overlay" style={{position:'fixed',inset:0,zIndex:35,background:'#10251d88',border:0}}/>}
    <aside className={`portal-side ${opened?'open':''}`}><Brand/><div className="portal-label">{configured ? 'School records' : 'School records · demo'}</div><nav className="portal-nav">{portalLinks.map(({label,href,icon:Icon})=><Link href={href} key={href} className={path===href?'active':''} onClick={()=>setOpened(false)}><Icon size={16}/>{label}</Link>)}</nav><div className="portal-label">Public website</div><nav className="portal-nav">{siteLinks.map(([label,href])=><Link href={href} key={href} onClick={()=>setOpened(false)}><Home size={15}/>{label}</Link>)}</nav><div className="portal-side-bottom">{configured ? `Firebase connected · ${profile?.role ?? 'staff'}` : <>Illustrative sample data<br/>No live school records connected.</>}</div></aside>
    <div className="portal-main"><header className="portal-topbar"><div className="portal-topbar-left"><button className="mobile-side-toggle" aria-label="Open management navigation" onClick={()=>setOpened(true)}><Menu size={21}/></button><span style={{font: '700 15px var(--app-font-serif)',color:'#214832'}}>{title}</span></div><div className="mini-note">{profile ? `Signed in as ${profile.displayName}` : 'Darul Muttaqeen · Staff portal preview'}</div>{configured && profile ? <button className="btn btn-outline" style={{padding:'8px 12px',fontSize:11}} onClick={async()=>{await signOut();setLocation('/login')}}>Sign out</button> : <Link href="/login" className="btn btn-outline" style={{padding:'8px 12px',fontSize:11}}>Staff sign in</Link>}</header><main className="portal-main-content">{children}</main></div>
  </div>;
}

function DemoHeader({title,description,action,isDemo=!firebaseConfigured}:{title:string;description:string;action?:ReactNode;isDemo?:boolean}) {
  return <div className="portal-title-row"><div><h1>{title}</h1><p>{description}</p></div><div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}><span className="demo-badge"><ShieldCheck size={13}/>{isDemo ? 'Sample data · demo only' : 'Firebase school records'}</span>{action}</div></div>;
}
function Metric({label,value,foot}:{label:string;value:string;foot:string}) { return <div className="metric-card"><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-foot">{foot}</div></div>; }
function initials(name:string) { return name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase(); }
function DataNotice({loading,error}:{loading:boolean;error:string}) {
  if (loading) return <div className="demo-callout" role="status">Loading school records…</div>;
  if (error) return <div className="demo-callout" role="alert">Could not load school records: {error}</div>;
  return null;
}

function StudentsPage() {
  const {records:remoteRows,loading,error,isDemo}=useSchoolCollection<Student>('students',initialStudents);
  const {profile}=useAuth();
  const canManage=!firebaseConfigured||profile?.role==='admin';
  const [localRows,setLocalRows]=useState(initialStudents); const rows=isDemo?localRows:remoteRows;
  const [search,setSearch]=useState(''); const [adding,setAdding]=useState(false); const [toast,setToast]=useState('');
  const filtered=useMemo(()=>rows.filter(r=>`${r.name} ${r.code} ${r.className}`.toLowerCase().includes(search.toLowerCase())),[rows,search]);
  async function add(e:FormEvent<HTMLFormElement>){e.preventDefault();if(!canManage)return;const d=new FormData(e.currentTarget);const name=String(d.get('name')||'').trim();if(!name)return;const className=String(d.get('className'));const classId=className.toLowerCase().replaceAll(' ','-');if(isDemo){setLocalRows([{id:`local-${Date.now()}`,name,code:`DEMO-${String(rows.length+1).padStart(3,'0')}`,className,classId,guardian:'Local demo entry',status:'Local draft'},...rows]);setToast('Local draft added in this browser only.')}else{try{await createStudentRecord({name,code:`DMIS-${Date.now().toString().slice(-6)}`,classId,className,guardian:'',status:'Active'});setToast('Student record saved.')}catch{setToast('The student record could not be saved. Check Firestore rules and try again.')}}setAdding(false);setTimeout(()=>setToast(''),3500)}
  async function remove(id:string){if(!canManage)return;if(isDemo){setLocalRows(rows.filter(s=>s.id!==id));setToast('Sample row removed locally.')}else{try{await deleteStudentRecord(id);setToast('Student record removed.')}catch{setToast('The student record could not be removed. Check administrator access.')}}setTimeout(()=>setToast(''),3000)}
  return <PortalShell title="Students"><DemoHeader title="Student records" description={isDemo?"Illustrative student profiles and class placements.":"School student profiles and class placements."} isDemo={isDemo} action={canManage&&<button onClick={()=>setAdding(true)} className="btn btn-primary" data-testid="button-add-student">{isDemo?'Add sample entry':'Add student'}</button>}/>
    <DataNotice loading={loading} error={error}/>
    <div className="metric-grid"><Metric label="Listed in this demo" value={String(rows.length)} foot="Illustrative records only"/><Metric label="Classes represented" value="4" foot="Sample class grouping"/><Metric label="Record status" value="Local" foot="Not connected to a database"/><Metric label="School year" value="Demo" foot="No official year specified"/></div>
    <section className="table-card"><div className="table-head"><h2>Student list <span className="mini-note">({filtered.length})</span></h2><div className="table-tools"><div style={{position:'relative',width:220}}><Search size={14} style={{position:'absolute',left:10,top:11,color:'#899486'}}/><input aria-label="Search students" className="searchbox" style={{paddingLeft:30}} placeholder="Search records" value={search} onChange={e=>setSearch(e.target.value)} data-testid="input-search-students"/></div></div></div><div className="table-wrap"><table><thead><tr><th>Student</th><th>Reference</th><th>Class</th><th>Guardian</th><th>Record</th>{canManage&&<th></th>}</tr></thead><tbody>{filtered.map(r=><tr key={r.id} data-testid={`row-student-${r.id}`}><td><div className="person-cell"><span className="avatar">{initials(r.name)}</span><span className="person-name">{r.name}</span></div></td><td>{r.code}</td><td>{r.className}</td><td>{r.guardian||'—'}</td><td><span className={`pill ${r.status==='Local draft'?'gold':''}`}>{r.status}</span></td>{canManage&&<td className="actions-cell"><button onClick={()=>void remove(r.id)} aria-label={`Remove ${r.name} record`} data-testid={`button-remove-student-${r.id}`}>Remove</button></td>}</tr>)}</tbody></table>{filtered.length===0&&<div className="empty-state">No student records match that search.</div>}</div></section>
    {adding&&<div className="form-modal-backdrop" role="presentation"><div className="form-modal"><h2>{isDemo?'Add local sample entry':'Add student record'}</h2><p className="hint">{isDemo?'This creates a temporary browser-only example, not a school record.':'This record will be saved to the school database.'}</p><form onSubmit={add}><div className="field" style={{marginTop:17}}><label htmlFor="new-student">Student name</label><input id="new-student" name="name" required/></div><div className="field" style={{marginTop:14}}><label htmlFor="new-student-class">Class</label><select name="className" id="new-student-class"><option>Primary 1</option><option>Primary 2</option><option>Primary 3</option><option>Primary 4</option><option>Primary 5</option><option>Primary 6</option></select></div><div className="modal-actions"><button type="button" className="btn btn-outline" onClick={()=>setAdding(false)}>Cancel</button><button className="btn btn-primary">{isDemo?'Add locally':'Save student'}</button></div></form></div></div>}{toast&&<div className="toast-message" role="status">{toast}</div>}
  </PortalShell>;
}

function TeachersPage() {
  const {records:teacherRecords,loading,error,isDemo}=useSchoolCollection<Teacher>('teachers',teachers);
  const [search,setSearch]=useState('');
  const rows=teacherRecords.filter(t=>`${t.name} ${t.subject} ${t.classes.join(' ')}`.toLowerCase().includes(search.toLowerCase()));
  return <PortalShell title="Teachers"><DemoHeader title="Teacher profiles" description={isDemo?"Fictitious profiles with illustrative subject and class assignments.":"School staff profiles and assigned classes."} isDemo={isDemo}/>
    <DataNotice loading={loading} error={error}/>
    <div className="metric-grid"><Metric label={isDemo?"Sample profiles":"Staff profiles"} value={String(teacherRecords.length)} foot={isDemo?"Not DMIS staff records":"Authorized school directory"}/><Metric label="Subjects shown" value={String(new Set(teacherRecords.map(t=>t.subject)).size)} foot={isDemo?"Illustrative assignments":"From school records"}/><Metric label="Class groups" value={String(new Set(teacherRecords.flatMap(t=>t.classes)).size)} foot={isDemo?"Demo only":"From school records"}/><Metric label="Profile state" value={isDemo?"Preview":"Connected"} foot={isDemo?"No staff directory connected":"Firebase records"}/></div>
    <section className="table-card"><div className="table-head"><h2>Teacher directory</h2><div style={{position:'relative',width:220}}><Search size={14} style={{position:'absolute',left:10,top:11,color:'#899486'}}/><input className="searchbox" style={{paddingLeft:30}} aria-label="Search teachers" placeholder="Search profiles" value={search} onChange={e=>setSearch(e.target.value)}/></div></div><div className="table-wrap"><table><thead><tr><th>Teacher</th><th>Subject</th><th>Assigned classes</th><th>Profile status</th></tr></thead><tbody>{rows.map(t=><tr key={t.id}><td><div className="person-cell"><span className="avatar">{t.initials}</span><span className="person-name">{t.name}</span></div></td><td>{t.subject}</td><td>{t.classes.map(c=><span className="pill" key={c} style={{marginRight:5}}>{c}</span>)}</td><td><span className="pill gold">{t.status}</span></td></tr>)}</tbody></table>{rows.length===0&&<div className="empty-state">No sample profiles match that search.</div>}</div></section>
  </PortalShell>;
}

function AcademicsPage() {
  const [active,setActive]=useState('Classes');
  const {records:classRows,loading:classesLoading,error:classesError,isDemo}=useSchoolCollection<{id:string;name:string;subjectCount:number}>('classes',classGroups);
  const {records:subjectsList,loading:subjectsLoading,error:subjectsError}=useSchoolCollection<{id:string;name:string;group:string}>('subjects',subjectRecords);
  const classes=classRows.map((item)=>item.name);
  return <PortalShell title="Academics"><DemoHeader title="Academics" description={isDemo?"A sample view of class groups and subject labels. This is not a verified DMIS curriculum.":"School class groups and subjects."} isDemo={isDemo}/>
    <DataNotice loading={classesLoading||subjectsLoading} error={classesError||subjectsError}/>
    <div className="tabbar">{['Classes','Subjects'].map(t=><button key={t} className={active===t?'active':''} onClick={()=>setActive(t)}>{t}</button>)}</div>
    {isDemo&&<div className="demo-callout" style={{marginBottom:18}}>Illustrative academic structure only. Subject names and class offerings should be confirmed by the school.</div>}
    {active==='Classes'?<section className="table-card"><div className="table-head"><h2>{isDemo?'Sample class groups':'Class groups'}</h2><span className="mini-note">{classes.length} {isDemo?'illustrative':'school'} entries</span></div><div className="table-wrap"><table><thead><tr><th>Class label</th><th>Example subject count</th><th>Data note</th></tr></thead><tbody>{classRows.map((c,i)=><tr key={c.id}><td><div className="person-cell"><span className="avatar">{String(i+1).padStart(2,'0')}</span><span className="person-name">{c.name}</span></div></td><td>{c.subjectCount??subjectsList.length} {isDemo?'sample subjects':'subjects'}</td><td><span className="pill muted">{isDemo?'Illustrative only':'School record'}</span></td></tr>)}</tbody></table>{classRows.length===0&&<div className="empty-state">No classes have been added yet.</div>}</div></section>:<section className="table-card"><div className="table-head"><h2>{isDemo?'Sample subjects':'Subjects'}</h2><span className="mini-note">{isDemo?'No official curriculum supplied':'School curriculum records'}</span></div><div className="table-wrap"><table><thead><tr><th>Subject</th><th>Group</th><th>Note</th></tr></thead><tbody>{subjectsList.map(s=><tr key={s.id}><td className="person-name">{s.name}</td><td>{s.group}</td><td><span className="pill muted">{isDemo?'Confirm with school':'School record'}</span></td></tr>)}</tbody></table>{subjectsList.length===0&&<div className="empty-state">No subjects have been added yet.</div>}</div></section>}
  </PortalShell>;
}

function grade(score:number) { return score>=80?'A':score>=70?'B':score>=60?'C':score>=50?'D':'E'; }
function ResultsPage() {
  const [selected,setSelected]=useState(0);
  const {records:resultRows,loading,error,isDemo}=useSchoolCollection<ResultRecord>('results',scores);
  const row=resultRows[selected]??resultRows[0];
  if (loading || error) return <PortalShell title="Results"><DemoHeader title="Report cards" description="Subject scores with totals and grades calculated automatically." isDemo={isDemo}/><DataNotice loading={loading} error={error}/></PortalShell>;
  if (!row) return <PortalShell title="Results"><DemoHeader title="Report cards" description="Subject scores with totals and grades calculated automatically." isDemo={isDemo}/><div className="empty-state">{isDemo?'No sample report cards are available.':'No report cards have been added yet.'}</div></PortalShell>;
  const rowSubjects=row.subjects?.length?row.subjects:subjects;
  const total=row.scores.reduce((a,b)=>a+b,0); const max=rowSubjects.length*100; const percent=max?(total/max*100).toFixed(1):'0.0';
  return <PortalShell title="Results"><DemoHeader title="Report cards" description="Subject scores with totals and grades calculated automatically." isDemo={isDemo}/>
    {isDemo&&<div className="demo-callout" style={{marginBottom:18}}>All learner names and marks below are fictitious sample data. These are not DMIS results and must not be used for decisions.</div>}
    <div className="table-card" style={{marginBottom:18}}><div className="table-head"><h2>Choose a {isDemo?'sample learner':'learner'}</h2><select aria-label="Select report card" value={selected} onChange={e=>setSelected(Number(e.target.value))} className="searchbox" style={{width:'auto'}}>{resultRows.map((s,i)=><option key={s.id} value={i}>{s.student} · {s.className}</option>)}</select></div>
      <div className="portal-main-content" style={{padding:'20px 22px 25px'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,flexWrap:'wrap',marginBottom:14}}><div><div className="mini-note">ILLUSTRATIVE REPORT CARD</div><div style={{font:'700 20px var(--app-font-serif)',color:'#1d4932',marginTop:4}}>{row.student} <span style={{fontSize:12,color:'#748074'}}>· {row.className}</span></div></div><span className="pill gold">Sample record</span></div>
         <div className="table-wrap"><table><thead><tr><th>Subject</th><th>Score / 100</th><th>Grade*</th></tr></thead><tbody>{rowSubjects.map((s,i)=><tr key={s}><td className="person-name">{s}</td><td>{row.scores[i]??0}</td><td className="grade">{grade(row.scores[i]??0)}</td></tr>)}</tbody><tfoot><tr><th>Total</th><th>{total} / {max}</th><th>Average {percent}%</th></tr></tfoot></table></div>
        <p className="mini-note" style={{marginTop:13}}>{isDemo?'*Demo grading bands: A ≥ 80, B ≥ 70, C ≥ 60, D ≥ 50, E below 50. These are example calculations, not a DMIS grading policy.':'Grades are calculated using the example bands A ≥ 80, B ≥ 70, C ≥ 60, D ≥ 50, E below 50. Confirm official DMIS grading bands before issuing results.'}</p>
      </div>
    </div>
    <div className="metric-grid"><Metric label="Automatic total" value={`${total} / ${max}`} foot="Calculated from sample subject scores"/><Metric label="Percentage" value={`${percent}%`} foot="Total divided by maximum score"/><Metric label="Subjects shown" value={String(subjects.length)} foot="Illustrative subject list"/><Metric label="Record status" value="Sample" foot="Not an official school result"/></div>
  </PortalShell>;
}

function FeesPage() {
  const {records:rows,loading,error,isDemo}=useSchoolCollection<{id:string;name:string;className:string;classId?:string;amount:number;paid:number}>('fees',initialFees);const [search,setSearch]=useState('');
  const filtered=rows.filter(r=>`${r.name} ${r.className}`.toLowerCase().includes(search.toLowerCase()));
  const paid=rows.reduce((a,b)=>a+b.paid,0);const outstanding=rows.reduce((a,b)=>a+(b.amount-b.paid),0);
  const money=(n:number)=>`₦${n.toLocaleString('en-NG')}`;
  return <PortalShell title="Fees"><DemoHeader title="Fee overview" description={isDemo?"Illustrative paid amounts and balances for fictitious student records.":"School fee records and outstanding balances."} isDemo={isDemo}/>
    <DataNotice loading={loading} error={error}/>
    {isDemo&&<div className="demo-callout" style={{marginBottom:18}}>Demo figures are not a DMIS fee schedule, invoices, or payment records. No official fees or policies have been supplied.</div>}
    <div className="metric-grid"><Metric label="Illustrative amount paid" value={money(paid)} foot="Fictitious sample amounts"/><Metric label="Illustrative balance" value={money(outstanding)} foot="Calculated from demo records"/><Metric label="Example entries" value={String(rows.length)} foot="Not school enrollment figures"/><Metric label="Fee schedule" value="Not set" foot="Confirm directly with the school"/></div>
    <section className="table-card"><div className="table-head"><h2>Sample payment ledger</h2><div style={{position:'relative',width:220}}><Search size={14} style={{position:'absolute',left:10,top:11,color:'#899486'}}/><input className="searchbox" style={{paddingLeft:30}} aria-label="Search fee examples" placeholder="Search examples" value={search} onChange={e=>setSearch(e.target.value)}/></div></div><div className="table-wrap"><table><thead><tr><th>Sample learner</th><th>Class</th><th>Illustrative amount</th><th>Amount paid</th><th>Outstanding</th><th>Status</th></tr></thead><tbody>{filtered.map(r=>{const balance=r.amount-r.paid;return <tr key={r.id}><td><div className="person-cell"><span className="avatar">{initials(r.name)}</span><span className="person-name">{r.name}</span></div></td><td>{r.className}</td><td>{money(r.amount)}</td><td>{money(r.paid)}</td><td className={balance?'fee-balance':''}>{money(balance)}</td><td><span className={`pill ${balance?'gold':''}`}>{balance?'Example balance':'Example paid'}</span></td></tr>})}</tbody></table>{filtered.length===0&&<div className="empty-state">No examples match that search.</div>}</div></section>
  </PortalShell>;
}

function PortalAccess({children,adminOnly=false}:{children:ReactNode;adminOnly?:boolean}) {
  const {configured,status,profile}=useAuth();
  if (!configured) return children;
  if (status==='loading') return <div className="login-shell"><p>Checking staff access…</p></div>;
  if (status!=='authorized') return <Redirect to="/login"/>;
  if (adminOnly && profile?.role!=='admin') return <PublicShell><main className="login-shell"><div className="login-card"><h1>Administrator access required</h1><p>This school information is restricted to authorized administrators.</p><Link className="btn btn-primary" href="/portal/students">Return to staff portal</Link></div></main></PublicShell>;
  return children;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch>
    <Route path="/" component={HomePage}/>
    <Route path="/about" component={AboutPage}/>
    <Route path="/admissions" component={AdmissionsPage}/>
    <Route path="/contact" component={ContactPage}/>
    <Route path="/login" component={LoginPage}/>
    <Route path="/portal/students">{()=><PortalAccess><StudentsPage/></PortalAccess>}</Route>
    <Route path="/portal/teachers">{()=><PortalAccess><TeachersPage/></PortalAccess>}</Route>
    <Route path="/portal/academics">{()=><PortalAccess><AcademicsPage/></PortalAccess>}</Route>
    <Route path="/portal/results">{()=><PortalAccess><ResultsPage/></PortalAccess>}</Route>
    <Route path="/portal/fees">{()=><PortalAccess adminOnly><FeesPage/></PortalAccess>}</Route>
    <Route component={NotFound}/>
  </Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><AuthProvider><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router/></WouterRouter><Toaster/></TooltipProvider></AuthProvider></QueryClientProvider>;
}

export default App;
