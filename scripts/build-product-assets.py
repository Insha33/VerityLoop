"""Author sharp, deterministic SVG product concepts with illustrative data.
Run: python3 scripts/build-product-assets.py
No external assets, fonts, or services required.
"""
from pathlib import Path
from html import escape
OUT = Path(__file__).resolve().parents[1] / 'public/product'
OUT.mkdir(parents=True, exist_ok=True)
INK='#101623'; MUTED='#646b76'; LINE='#ece7e1'; BLUE='#b93f35'; SOFT='#fff0ec'; GREEN='#28785c'

def rect(x,y,w,h,fill='white',r=0,stroke=None):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"'+(f' stroke="{stroke}"' if stroke else '')+'/>'
def text(x,y,s,size=13,fill=INK,weight=400):
    return f'<text x="{x}" y="{y}" fill="{fill}" font-size="{size}" font-weight="{weight}">{escape(str(s))}</text>'
def line(x,y,x2,y2,col=LINE):
    return f'<path d="M{x} {y}H{x2}" stroke="{col}"/>' if y==y2 else f'<path d="M{x} {y}L{x2} {y2}" stroke="{col}"/>'
def dot(x,y,col=BLUE,r=3):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{col}"/>'
def icon(x,y,kind='grid',col=MUTED):
    paths={'grid':'M1 1h5v5H1z M10 1h5v5h-5z M1 10h5v5H1z M10 10h5v5h-5z','inbox':'M2 3h12l2 11H0z M1 9h4l2 3h2l2-3h4','file':'M3 1h7l4 4v10H3z M6 8h5 M6 11h5','search':'M11 11l4 4 M12 7a5 5 0 1 1-10 0a5 5 0 1 1 10 0','check':'M3 8l3 3 7-7','spark':'M8 0l2 5 6 3-6 2-2 6-2-6-6-2 6-3z','link':'M6 4l2-2a4 4 0 0 1 6 6l-2 2 M10 12l-2 2a4 4 0 0 1-6-6l2-2 M5 11l6-6','arrow':'M2 8h12 M9 3l5 5-5 5','plus':'M8 2v12 M2 8h12'}
    return f'<g transform="translate({x} {y})" fill="none" stroke="{col}" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><path d="{paths[kind]}"/></g>'
def pill(x,y,w,label,fill=SOFT,col=BLUE):
    return rect(x,y,w,25,fill,5)+f'<text x="{x+w/2}" y="{y+12.5}" fill="{col}" font-size="11" font-weight="500" text-anchor="middle" dominant-baseline="central">{escape(label)}</text>'
def avatar(x,y,initials,fill='#e6e8f0'):
    return dot(x,y,fill,12)+text(x-8,y+4,initials,9,INK,600)
def logo(x,y):
    return ''.join(rect(x+i*5,y+20-h,3,h,'#2768ff' if i<3 else '#ff5a4f',1.5) for i,h in enumerate([8,14,20,12]))
def lines(x,y,strings,size=13,col=MUTED,gap=21,weight=400):
    return ''.join(text(x,y+i*gap,s,size,col,weight) for i,s in enumerate(strings))
def shell(title,active='Signals'):
    s=rect(0,0,1280,760,'#fff',12)+rect(0,0,196,760,'#f9fafb',12)+rect(185,0,11,760,'#f9fafb')+line(196,0,196,760)
    s+=logo(22,24)+text(50,40,'VerityLoop',16,INK,650)+text(169,40,'⌄',14,MUTED)
    s+=rect(14,69,168,33,'#fff',5,LINE)+icon(25,78,'search')+text(50,91,'Search anything',11,MUTED)+text(157,91,'/',11,MUTED)
    for i,(name,ic) in enumerate([('Overview','grid'),('Signals','inbox'),('Evidence','search'),('Decisions','spark'),('Delivery','file')]):
        yy=125+i*38
        if name==active:s+=rect(12,yy-6,172,33,SOFT,5)
        s+=icon(25,yy,ic,BLUE if name==active else MUTED)+text(51,yy+12,name,12,BLUE if name==active else MUTED,550 if name==active else 400)
        if name=='Signals':s+=text(159,yy+12,'12',11,BLUE)
    s+=text(25,349,'WORKSPACE',9,MUTED,550)+text(26,380,'Product strategy',12,MUTED)+text(26,414,'Decision memory',12,MUTED)+icon(25,442,'link')+text(51,454,'Sources',12,MUTED)
    s+=line(16,692,180,692)+avatar(34,721,'AK','#e6e9dd')+text(54,719,'Alex Kim',11,INK,600)+text(54,735,'Acme workspace',10,MUTED)
    s+=text(224,34,'Workspace',11,MUTED)+text(300,34,'/',11,'#c4c8cf')+text(316,34,title,11,INK,500)+line(196,55,1280,55)
    s+=avatar(1166,29,'AK','#e6e9dd')+avatar(1186,29,'JL','#efe2d9')+rect(1213,17,47,24,'#fff',5,LINE)+text(1225,33,'Share',10,MUTED)
    return s

def workspace():
    s=shell('Signal inbox')
    s+=text(230,103,'Signal inbox',24,INK,600)+text(230,129,'A little less noise. A clearer next move.',12,MUTED)
    s+=rect(1104,81,141,32,INK,5)+icon(1116,89,'plus','#fff')+text(1139,102,'Capture signal',11,'#fff',500)
    s+=text(232,176,'All signals',12,INK,600)+pill(304,158,27,'12','#f0f1f3',MUTED)+text(352,176,'Needs review',12,MUTED)+text(475,176,'Watching',12,MUTED)+line(230,192,1245,192)+line(230,192,331,192,BLUE)
    s+=icon(232,215,'search')+text(259,228,'Search signals...',11,MUTED)+text(688,228,'Filter',11,MUTED)+line(230,246,753,246)
    rows=[('Pricing flexibility is becoming a buying factor','Competitor pricing · Customer calls','4 sources','Review','#f1f3fd'),('Support teams keep rebuilding the same handoff','Reviews · Founder notes','6 sources','Investigate','#fff'),('A new entrant targets mid-market teams','Product launch · Market update','3 sources','Watch','#fff'),('Customers want a simpler approval workflow','Customer calls · Support tickets','8 sources','Review','#fff'),('Usage visibility appears in renewal calls','Customer calls · Product feedback','5 sources','Watch','#fff')]
    for i,(title,meta,count,status,bg) in enumerate(rows):
        yy=257+i*89;s+=rect(218,yy,539,80,bg,6)+dot(234,yy+21,BLUE if i==0 else '#b8bec8',3)
        s+=text(248,yy+26,title,12,INK,550)+text(248,yy+48,meta,10,MUTED)+text(248,yy+68,count,10,MUTED)
        s+=pill(661,yy+(80-25)/2,82,status,'#e6eafa' if i==0 else '#f2f3f5',BLUE if i==0 else MUTED)
    s+=line(781,192,781,760)
    s+=icon(812,216,'spark',BLUE)+text(836,229,'SIGNAL BRIEF',10,MUTED,600)+pill(1135,211,102,'Ready to review','#eaf4ef',GREEN)
    s+=lines(812,275,['Pricing flexibility is','becoming a buying factor'],22,INK,29,600)
    s+=lines(812,350,['A competitor introduced usage-based pricing.','Three recent customer conversations mention','the same need for more flexible plans.'],12,MUTED,21)
    s+=text(812,437,'What the evidence says',12,INK,600)
    for i,(title,meta) in enumerate([('Pricing model changed','Product page · verified source'),('Customers mention flexibility','3 customer calls · connected context'),('Demand is still unproven','Willingness to pay needs validation')]):
        yy=462+i*55;s+=icon(813,yy,'check' if i<2 else 'search',GREEN if i<2 else '#a17f46')+text(838,yy+11,title,12,INK,500)+text(838,yy+29,meta,10,MUTED)
    s+=rect(809,644,428,76,'#f6f7fb',7)+text(826,669,'Recommended next step',10,MUTED)+text(826,692,'Validate before the roadmap moves.',13,INK,550)+icon(1204,678,'arrow',BLUE)
    return s

def evidence():
    s=shell('Evidence review','Evidence')
    s+=text(235,107,'Follow the signal. See the source.',25,INK,600)+text(235,137,'Pricing flexibility  /  Evidence review',12,MUTED)
    s+=pill(1070,86,165,'4 sources cross-checked','#eaf4ef',GREEN)
    s+=text(235,193,'Evidence',12,BLUE,600)+text(334,193,'Customer context',12,MUTED)+text(481,193,'Open questions',12,MUTED)+line(234,210,1244,210)
    s+=rect(233,239,635,216,'#fff',8,LINE)+pill(254,257,102,'Primary source','#f2f3f5',MUTED)+text(254,311,'A pricing change, in the original words.',18,INK,550)
    s+=rect(254,332,592,49,'#f3f5fd',3)+text(268,362,'“Pay for what you use, with no annual commitment.”',15,INK,500)
    s+=text(254,416,'Competitor pricing page',11,MUTED)+text(702,416,'Captured Sep 4',10,MUTED)
    s+=rect(233,474,635,205,'#fff',8,LINE)+pill(254,492,112,'Customer context','#f2f3f5',MUTED)+text(254,547,'The same need, from your customers.',18,INK,550)
    s+=lines(254,580,['“We need room to scale down in quieter months.','A fixed plan makes it hard to get this approved.”'],14,INK,24)
    s+=avatar(268,648,'JL','#efe2d9')+text(290,647,'Customer discovery call',11,MUTED)+text(708,649,'Source 2 of 4',10,MUTED)
    s+=rect(900,239,344,440,'#f9fafc',8)+icon(923,262,'spark',BLUE)+text(948,275,'Evidence assessment',13,INK,600)
    s+=lines(923,322,['The change is verified.','The opportunity needs testing.'],16,INK,24,550)
    s+=line(923,374,1220,374)+text(923,407,'SUPPORTED',10,GREEN,600)+lines(923,435,['The pricing model has changed.','Flexibility appears in customer calls.'],12,MUTED,22)
    s+=text(923,508,'STILL UNKNOWN',10,'#806132',600)+lines(923,536,['How many customers need this?','Would they pay for a different plan?','Does it fit our product strategy?'],12,MUTED,23)
    s+=text(923,642,'Every claim keeps its citation.',11,BLUE,500)
    return s

def decision():
    s=shell('Decision brief','Decisions')
    s+=text(235,107,'A clear next move.',25,INK,600)+text(235,138,'DEC-014  /  Pricing flexibility',12,MUTED)+pill(1108,85,133,'Awaiting approval','#fbf1df','#89682b')
    s+=line(233,169,1245,169)+text(244,214,'Decision brief',12,BLUE,600)+text(365,214,'Evidence · 4',12,MUTED)+text(491,214,'Activity',12,MUTED)
    s+=text(244,280,'Validate flexible pricing',29,INK,600)+lines(244,316,['Explore the need before committing engineering time.','Keep the roadmap steady while we resolve the unknowns.'],13,MUTED,23)
    s+=text(244,396,'Why this direction',14,INK,600)+lines(244,428,['The market change is real and customers mention the same problem.','That is a reason to investigate, but not yet a reason to build.'],13,MUTED,23)
    s+=text(244,508,'What we need to learn',14,INK,600)
    for i,t in enumerate(['Interview 5 customers about pricing constraints','Test willingness to pay for a flexible plan','Review overlap with the current packaging roadmap']):
        yy=532+i*41;s+=rect(245,yy,15,15,'white',3,'#d4d8df')+text(275,yy+12,t,12,INK)
    s+=line(244,674,831,674)+avatar(258,707,'AK','#e6e9dd')+text(280,705,'Alex Kim',11,INK,550)+text(280,723,'Decision owner',10,MUTED)
    s+=rect(899,204,347,514,'#f8f9fb',8)+text(924,240,'Compare the options',13,INK,600)
    for i,(title,desc,chosen) in enumerate([('Validate','Resolve the evidence gaps',True),('Watch','Revisit when the signal changes',False),('Ignore for now','Keep the reason in decision memory',False)]):
        yy=261+i*91;s+=rect(918,yy,310,77,SOFT if chosen else '#fff',6, '#dbe1fb' if chosen else LINE)+dot(938,yy+25,BLUE if chosen else '#d5d8df',5)+text(954,yy+29,title,13,BLUE if chosen else INK,550)+text(936,yy+54,desc,11,MUTED)
    s+=line(923,561,1223,561)+icon(924,582,'check',GREEN)+text(948,594,'Your team makes the call.',12,INK,550)+lines(924,618,['No roadmap changes or external work','without a person approving the direction.'],11,MUTED,18)
    s+=rect(920,665,306,34,INK,5)+text(993,687,'Approve validation plan',11,'#fff',550)
    return s

for name,body,title in [('workspace',workspace(),'VerityLoop signal inbox'),('evidence',evidence(),'VerityLoop evidence review'),('decision',decision(),'VerityLoop decision brief')]:
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="760" viewBox="0 0 1280 760" role="img"><title>{title} — illustrative product preview</title><defs><clipPath id="frame"><rect width="1280" height="760" rx="12"/></clipPath></defs><g clip-path="url(#frame)" font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif">{body}</g></svg>'
    (OUT/f'{name}.svg').write_text(svg)
print('Created workspace.svg, evidence.svg, decision.svg')
# Focused compositions retain readable product detail on smaller canvases.
for name,body,view,w,h in [('workspace-mobile',workspace(),'798 195 454 543',454,543),('signal-detail',workspace(),'802 202 441 524',441,524),('evidence-detail',evidence(),'226 232 650 455',650,455),('decision-detail',decision(),'909 201 327 518',327,518)]:
    (OUT/f'{name}.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="{view}" role="img"><title>Illustrative VerityLoop product detail</title><g font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif">{body}</g></svg>')
