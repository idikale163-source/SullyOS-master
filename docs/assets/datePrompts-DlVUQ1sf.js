import{L as v,as as I,at as O,au as _,av as G}from"./index-CnWPGonx.js";import{i as Y}from"./memory-palace-C2CFMAx4.js";const Z='4. **语音情绪（跟立绘分开）**: `[emotion]` 只管**立绘表情**。台词会被朗读成真实语音，而立绘的夸张表情 ≠ 语音里的情绪——立绘 happy 是个灿烂笑脸，语音 happy 却会变成过度上扬的腔调，常常不对味。所以**语音情绪要单独标**：在台词行末尾加 `[v:xxx]`，xxx 仅限 happy/sad/angry/fearful/disgusted/surprised/calm。\n   - 不是每句都要标——情绪平淡、自然说话时**不标**（默认更真实），只在台词确实有明显情绪、且和立绘强度不一致时才标。\n   - 立绘可以夸张、语音要克制。例：`[happy] "……真的吗？我等这句话好久了。" [v:calm]`（脸上是惊喜，声音是压着的温柔）。\n   - `[v:xxx]` 只写在带引号的台词行，动作/叙述行不用标。',M=t=>{const e=_(t),o=["周日","周一","周二","周三","周四","周五","周六"];return`${O.formatDate(e.getTime(),t)} ${o[e.getDay()]}`},y=t=>t.dateTimeAwarenessEnabled!==!1,Q=["normal","happy","angry","sad","shy"],g=[{id:"cinematic",label:"电影感",hint:"默认风格。沉浸式镜头感，感官细节丰富，有呼吸和停顿。",peekHint:"电影感，沉浸式，细节丰富",block:`### ⭐ 动作与叙述行的写法（风格：电影感）
你不是在列清单，你是在写一个正在发生的场景。每一行动作/叙述都应该让人感受到**此时此刻的空气**。

**具体要求**：
- 写出**感官**：光线怎么落的、空气什么味道、皮肤什么触感、周围什么声音
- 写出**节奏**：动作之间有停顿、有犹豫、有呼吸，不要一口气做完三个动作
- 写出**情绪的痕迹**：不要说"他很紧张"，而是写他的手指在桌面上画了一道看不见的线
- 让每一行都有**画面**，像电影里的一个镜头

❌ **不要这样写**（只用一个情绪 + 干巴巴的动作罗列）：
[normal] 把手放下，看向你。
走到你身边，坐下来。
拿起杯子，喝了一口水。

✅ **要这样写**（每行标注情绪 + 有画面、有停顿的叙述）：
[normal] 指尖从发梢滑落，垂在身侧。视线转过来的时候并不急，像是刚好、又像是故意。
[shy] "……你一直在看我吗？"
[happy] 嘴角的弧度藏不住，像是被戳中了什么小心思。
[normal] 脚步踩在木地板上的声音很轻。在你旁边坐下来，衣料带过一缕还没散尽的冷风。`},{id:"plain",label:"简洁白描",hint:"短句克制，不堆形容词，动作干净，靠留白说话。",peekHint:"简洁白描，短句克制，多留白",block:`### ⭐ 动作与叙述行的写法（风格：简洁白描）
用最少的字写最准的动作。短句，克制，不堆形容词，不滥用比喻。

**具体要求**：
- 一行只做一件事，动作干净利落
- 情绪藏在"做了什么/没做什么"的选择里，不点破、不渲染
- 善用留白：话说一半，停下来，让沉默自己说话

❌ **不要**：堆砌华丽辞藻、一行塞三个动作、直接写"他很开心/紧张"。
✅ **示例**：
[normal] 放下杯子。
[normal] "来了。"
[shy] 视线挪开，落在窗外。`},{id:"lyrical",label:"细腻文艺",hint:"绵密温柔，心理与感官交织，可用比喻和意象。",peekHint:"细腻文艺，感官与心理交织，意象贴合情绪",block:`### ⭐ 动作与叙述行的写法（风格：细腻文艺）
绵密、温柔、向内。心理活动和感官交织，可以用比喻和意象，但必须贴合此刻的情绪，不为修辞而修辞。

**具体要求**：
- 写光线、温度、气味这些容易被忽略的细节
- 动作之外，写动作背后那一层没说出口的心事
- 允许长句，但每一行仍只承载一个情绪节拍

✅ **示例**：
[normal] 茶杯沿上的热气慢慢散了，像一句没说完就被收回去的话。
[shy] "……今天的风，把人吹得有点想说实话。"
[happy] 指尖在桌面轻轻敲了两下，藏不住的雀跃顺着指节漏出来。`},{id:"playful",label:"轻快幽默",hint:"节奏明快，生活化，带点俏皮和小吐槽。",peekHint:"轻快幽默，生活化，带点俏皮",block:`### ⭐ 动作与叙述行的写法（风格：轻快幽默）
节奏明快，生活化，像情景喜剧的分镜，不端着。

**具体要求**：
- 动作可以夸张一点点，但要可爱不要闹剧
- 台词口语化，可以打趣、抬杠、自我吐槽
- 幽默来自细节和反差，不是硬讲笑话

✅ **示例**：
[happy] 叼着吸管，含糊不清地比了个"过来"的手势。
[normal] "你再迟到一分钟，这杯奶茶里的珍珠就要被我替你报仇了。"
[shy] 说完自己先没绷住，耳朵尖红了一点。`},{id:"intense",label:"浓烈炽热",hint:"情绪张力拉满，呼吸、心跳、距离感，克制边缘的爆发。",peekHint:"张力浓烈，感官冲击具体，空气绷紧",block:`### ⭐ 动作与叙述行的写法（风格：浓烈炽热）
情绪张力拉满。呼吸、心跳、距离感，每一行都往前压一步。

**具体要求**：
- 感官冲击要具体：温度、力度、停在半空的手
- 沉默和对视也是戏，写出空气绷紧的感觉
- 浓烈不等于直白嘶吼，克制边缘的爆发更有力量

✅ **示例**：
[normal] 一步，又一步。影子先碰到了你的影子。
[angry] "刚才那句话，再说一遍。"
[shy] 呼吸在离得很近的地方，乱了半拍。`}],W="cinematic",D=t=>g.find(e=>e.id===((t==null?void 0:t.style)||W))||g[0],q=(t,e,o)=>{const n=o||"对方";switch(t==null?void 0:t.pov){case"third-name":return`### 叙事人称（必须严格遵守）
叙述行使用**第三人称**：称呼你自己为「${e}」，称呼对方为「${n}」。叙述里不要出现"我""你"。
示例：${e}看向${n}，伸手替${n}拢了拢被风吹乱的头发。
（台词引号内不受限，正常说话即可。上方风格示例中的人称仅为格式示意，一律以本节为准。）
`;case"third-you":return`### 叙事人称（必须严格遵守）
叙述行中称呼你自己为「${e}」（第三人称），称呼对方为"你"。叙述里不要用"我"指代自己。
示例：${e}看向你，伸手替你拢了拢被风吹乱的头发。
（台词引号内不受限，正常说话即可。上方风格示例中的人称仅为格式示意，一律以本节为准。）
`;case"first-you":return`### 叙事人称（必须严格遵守）
叙述行使用**第一人称**：称呼你自己为"我"，称呼对方为"你"。不要在叙述里用自己的名字指代自己。
示例：我看向你，伸手替你拢了拢被风吹乱的头发。
（上方风格示例中的人称仅为格式示意，一律以本节为准。）
`;default:return""}},V=t=>{const e=((t==null?void 0:t.extra)||"").trim();return e?`### 用户对文风的额外要求（优先级高于风格预设）
${e}
`:""},L=t=>(t==null?void 0:t.digDeeper)!==!1,z=`### 💎 素材永远比你以为的多（深挖，别填充）
对方哪怕随口一句话，都至少藏着这些可以接的线：
1. **ta的用词**——为什么是这个词？换个人不会这么说。
2. **ta怎么说的**——语速、音量、说话时手在干什么、眼睛看哪。
3. **ta没说的**——这句话省略了什么？和ta平时的样子比，哪里不一样？
4. **现场**——此刻的光线、声音、桌上的东西，随便一样都能参与进互动。
5. **你们的过去**——这句话让你想起哪件只有你们知道的事？
6. **你自己**——它在你心里激起的第一反应是什么？你压下去了，还是说了出来？

比如对方只说了句"有点累"，能接的就有：累的是身体还是别的；ta说这话时把包放下的动作；你上次见ta累成这样是什么时候；要不要把窗边那杯还温着的水推过去。

规则：
- 每一轮只挑**一两条线**往深处走，写透它。不要每条都碰——什么都写等于什么都没写。
- 觉得"没什么可写"的时候，恰恰说明该回到上面的清单里找。空泛的感慨和万能句式都是没话找话，宁可写一个具体的小动作。
`,T=["从对方刚才的用词里挑一个词，作为这一轮回应的起点","让场景里的一件具体物品参与到这一轮互动里","写一个克制的身体细节——距离、姿态、或一个没完成的动作","把对方这句话和你们的一段过去连起来（只有你们知道的事）",'这一轮重点回应对方"怎么说"而不是"说了什么"——语气、停顿、视线',"写一个你心里闪过但没说出口的念头，让它影响你的下一句话","留意对方没说出口的部分，回应那个空白","让此刻的环境（光线、声音、温度）影响你说话的方式"],J=()=>T[Math.floor(Math.random()*T.length)],x="⟦OBSERVE⟧",C="⟦/OBSERVE⟧",$="[\\[\\(<⟦【〔「『]",E="[\\]\\)>⟧】〕」』]",h="(?:OBSERVE|观测协议|观测)",X=new RegExp(`${$}\\s*${h}\\s*${E}([\\s\\S]*?)${$}\\s*/\\s*${h}\\s*${E}`,"i"),tt=new RegExp(`^\\s*${$}?\\s*/?\\s*${h}\\s*/?\\s*${E}?\\s*$`,"i"),b=t=>tt.test(t.trim()),N=/^\s*(?:[-*>•·]\s*)?\*{0,2}\s*(时间|地点|地区|场所|位置|状态|心境|情绪|细节|动作|举动|time|place|location|site|position|status|state|mood|detail|trace|action)\s*\*{0,2}\s*[｜|:：]\s*(.+?)\s*$/i,w=t=>{const e=t.toLowerCase();return/时间|time/.test(e)?"time":/地点|地区|场所|位置|place|location|site|position/.test(e)?"place":/状态|心境|情绪|status|state|mood/.test(e)?"state":/细节|动作|举动|detail|trace|action/.test(e)?"detail":null},S=t=>{let e=t.trim();return e=e.replace(new RegExp(`${$}\\s*/?\\s*${h}\\s*/?\\s*${E}`,"gi"),""),e=e.replace(/^\*{1,2}|\*{1,2}$/g,"").trim(),e=e.replace(/^（\s*|\s*）$/g,"").trim(),e=e.replace(/^\(\s*|\s*\)$/g,"").trim(),e.trim()},f=t=>{var e;return((e=t.dateObserve)==null?void 0:e.enabled)===!0},et=[{key:"time",label:"时间",en:"TIME",glyph:"◷",hint:'结合场景的当下时刻，可比系统时间更具体，如"傍晚六点过，天刚擦黑"'},{key:"place",label:"地点",en:"SITE",glyph:"⌖",hint:"{name}此刻所在的具体地点与环境"},{key:"state",label:"状态",en:"STATE",glyph:"❖",hint:"{name}的身心状态：情绪、体感、正在经历的内在波动"},{key:"detail",label:"细节",en:"TRACE",glyph:"✶",hint:"此刻最值得被注意的一个动作 / 微小细节"}],R=["✦","◆","❂","✺","⬡","◈"],nt=(t,e="")=>{const o=(t==null?void 0:t.fields)||{},n=et.filter(s=>{var a;return((a=o[s.key])==null?void 0:a.enabled)!==!1}).map(s=>{var a,r;return{key:s.key,label:s.label,display:(((a=o[s.key])==null?void 0:a.label)||"").trim()||s.label,en:s.en,glyph:s.glyph,hint:((((r=o[s.key])==null?void 0:r.hint)||"").trim()||s.hint).replace(/\{name\}/g,e),isCustom:!1}}),i=((t==null?void 0:t.custom)||[]).filter(s=>s.enabled!==!1&&(s.label||"").trim()).map((s,a)=>({key:s.id,label:s.label.trim(),display:s.label.trim(),en:"NOTE",glyph:R[a%R.length],hint:((s.hint||"").trim()||`观察并描写「${s.label.trim()}」`).replace(/\{name\}/g,e),isCustom:!0}));return[...n,...i]},H=t=>{const e=nt(t.dateObserve,t.name);if(e.length===0)return"";const o=e.map(n=>`${n.label}｜（${n.hint}）`).join(`
`);return`
### 👁 观测协议（OBSERVE，必须严格执行）
在你**整段回复的最前面**，先输出一段「观测块」，用来让用户全方位观察${t.name}此刻的状态。
观测块**不受**上面「一行一念 / 每行 [emotion] 开头」规则约束——它是独立的元信息，紧接着才是正常的 VN 正文。

格式**必须**逐字如下（每个字段都要给，每项一句话、简洁有画面，别写成大段）：
${x}
${o}
${C}

硬性要求：
- 开头那行 \`${x}\` 和结尾那行 \`${C}\` **两行定界符都必须原样保留**，各自单独占一行，哪怕你不确定也别省略。
- 每个字段各占一行，用全角竖线 \`｜\` 分隔标签和内容；标签必须原样用 ${e.map(n=>`「${n.label}」`).join("、")}，不要加序号、不要用 markdown 加粗。
- 观测块只在整段回复的最开头出现一次，输出完**另起一行**再写 VN 正文（每行 [emotion] 开头）。`},$t=(t,e={})=>{if(!t)return{observation:null,rest:t};const o=(e.custom||[]).filter(i=>i.enabled!==!1&&(i.label||"").trim()),n=t.match(X);if(n&&n.index!==void 0){const i=it(n[1],o);if(lt(i)){const s=rt(t.slice(0,n.index)+t.slice(n.index+n[0].length));return{observation:i,rest:s}}}if(e.lenient){const i=at(t,o);if(i)return i}return{observation:null,rest:t}},st=/^\s*(?:[-*>•·]\s*)?\*{0,2}\s*([^｜|:：*\n]{1,16}?)\s*\*{0,2}\s*[｜|:：]\s*(.+?)\s*$/,A=(t,e)=>{if(!e.length)return null;const o=t.match(st);if(!o)return null;const n=o[1].trim().toLowerCase(),i=e.find(s=>s.label.trim().toLowerCase()===n);return i?{id:i.id,value:S(o[2])}:null},P=(t,e,o)=>{o&&(t.extra=t.extra||{},t.extra[e]||(t.extra[e]=o))},ot=t=>(t.time?1:0)+(t.place?1:0)+(t.state?1:0)+(t.detail?1:0)+Object.keys(t.extra||{}).length,it=(t,e=[])=>{const o={};for(const n of t.split(`
`)){const i=n.match(N);if(i){const a=w(i[1]),r=S(i[2]);a&&r&&!o[a]&&(o[a]=r);continue}const s=A(n,e);s&&P(o,s.id,s.value)}return o},at=(t,e=[])=>{const o=t.split(`
`);let n=0;for(;n<o.length&&!o[n].trim();)n++;n<o.length&&b(o[n])&&n++;const i={};let s=n-1;const a=n+12;for(let l=n;l<o.length&&l<a;l++){const c=o[l].trim();if(!c)continue;if(b(o[l])){s=l;continue}const m=c.match(N);if(m){const d=w(m[1]),p=S(m[2]);d&&p&&!i[d]&&(i[d]=p),s=l;continue}const u=A(c,e);if(!u)break;P(i,u.id,u.value),s=l}if(ot(i)<2)return null;const r=o.slice(s+1).join(`
`).trim();return{observation:i,rest:r}},rt=t=>t.split(`
`).filter(e=>!b(e)&&!/^\s*```/.test(e)).join(`
`).trim(),lt=t=>!!t&&!!(t.time||t.place||t.state||t.detail||t.extra&&Object.keys(t.extra).length>0),ct=t=>[...Q,...t.customDateSprites||[]],B=(t,e)=>{if(!t)return"这是你们的初次互动。";const n=Date.now()-t,i=Math.floor(n/(1e3*60)),s=Math.floor(n/(1e3*60*60)),a=_(e).getHours(),r=a>=23||a<=6;return i<5?"":i<60?`[系统提示: 距离上次互动: ${i} 分钟。]`:s<6?r?`[系统提示: 距离上次互动: ${s} 小时。现在是深夜/清晨。]`:`[系统提示: 距离上次互动: ${s} 小时。]`:s<24?`[系统提示: 距离上次互动: ${s} 小时。]`:`[系统提示: 距离上次互动: ${Math.floor(s/24)} 天。]`},mt=t=>t.map(e=>{const o=typeof e.content=="string"?e.content:Array.isArray(e.content)?e.content.filter(n=>(n==null?void 0:n.type)==="text").map(n=>n.text).join(" "):"";return`${e.role}: ${o}`}).join(`
`),ut=(t,e)=>{const n=y(t)?`1. **Time**: 当前时间 ${M(I(t))}。
`:"",i=ct(t),s=t.dateStyleConfig,a=D(s),r=q(s,t.name,e),l=V(s),c=L(s)?`${z}
`:"",m=f(t)?H(t):"";return`### [Visual Novel Mode: 视觉小说脚本模式]
你正在与用户进行**面对面**的互动。这不是聊天，是一场真实的见面。

### 核心规则：一行一念 (One Line per Beat)
前端解析器基于**换行符**来分割气泡。
1. **禁止混写**: 严禁在同一行里既写动作又写带引号的台词。
2. **情绪标签**: **每一行都必须以** \`[emotion]\` **开头**，表示该行的表情立绘。情绪随内容变化——台词温柔就用 [happy]，动作紧张就用 [shy]，语气冲就用 [angry]。**不要整段只用一个情绪，要逐行根据语境切换。** 仅限使用以下情绪: ${i.join(", ")}。不要使用任何不在此列表中的标签。
3. **格式**: 台词用双引号 **"..."**，动作/叙述直接写（不加引号）。
${t.dateVoiceEnabled?G("dateVoice")??Z:""}

${a.block}

${c}${r}${l}### 场景上下文
${n}- **Location**: 你们现在**面对面**。
- **Context**: 参考历史记录。如果刚刚才看到开场白（Opening），请自然接话。
${m}`},dt=(t,e,o,n)=>{const i=e.contextLimit||500,s=parseInt(localStorage.getItem(`mp_lastMsgId_${e.id}`)||"0",10),r=(s>0?t.filter(c=>c.id>s):t).slice(0,-1),{apiMessages:l}=O.buildMessageHistory(r,i,e,o||{},n);return l},Et={getTimeGapHint:B,buildPeekPayload:t=>{const{char:e,userProfile:o,allMsgs:n,emojis:i}=t,s=I(e),a=y(e),r=M(s),l=e.contextLimit||500,c=Math.min(l,50),m=n[n.length-1],u=B(m==null?void 0:m.timestamp,s),{apiMessages:d}=O.buildMessageHistory(n,c,e,o||{},i),p=mt(d),j=v.buildCoreContext(e,o,!1,void 0,void 0,{skipTimeAwareness:!y(e)}),F=D(e.dateStyleConfig),k=V(e.dateStyleConfig),K=u?`

--- [TIME SKIP: ${u}] ---

`:`

--- [SCENE CONTINUATION: 刚刚还在聊天，现在来到了面对面的场景] ---

`,U=`
### 场景：感知 (Sense Presence)
${a?`当前时间: ${r}
`:""}时间上下文: ${u}

### 任务
你现在并不在和用户直接对话。用户正在悄悄靠近你所在的地点。
请用**第三人称**描写一段话。
描述：${e.name} 此时此刻正在做什么？周围环境是怎样的？状态如何？

### 逻辑检查
1. **上下文连贯性**: 参考 [最近记录]（注意消息来源标签：[聊天]是文字聊天、[约会]是面对面、[通话]是语音通话）。如果有 [TIME SKIP] 且间隔很久，开启新场景；如果是 [SCENE CONTINUATION]，说明刚刚还在聊天，**必须**自然衔接最近的聊天话题和情绪状态，不要无视之前的对话内容。
2. **状态一致性**: ${u.includes("天")?"如果间隔了很多天，可能在发呆、忙碌或者有点落寞。":"根据最近的聊天内容和情绪来决定当前状态。如果刚聊完，角色的状态应该与聊天内容相呼应。"}
3. **描写风格**: ${F.peekHint}。${f(e)?"先按下方「观测协议」输出观测块，再开始描写内容（描写本身不要加任何前缀）。":"不要输出任何前缀，直接输出描写内容。"}
${k?`
${k}`:""}${f(e)?`
${H(e)}`:""}`;return{messages:[{role:"system",content:j},{role:"user",content:`[最近记录 (Previous Context)]:${p}${K}${U}

(Start sensing...)`}]}},buildSessionPayload:async t=>{const{char:e,userProfile:o,allMsgs:n,emojis:i,userText:s,variant:a}=t,r=dt(n,e,o,i);await Y(e,n,void 0,o==null?void 0:o.name);const l=v.buildCoreContext(e,o,!0,void 0,void 0,{skipTimeAwareness:!y(e)})+ut(e,(o==null?void 0:o.name)||""),c=L(e.dateStyleConfig)?` 本轮线索：${J()}。`:"",m=a==="send"?`(System Note: 严格遵守 VN 格式。每一行都要以 [emotion] 开头，根据内容逐行切换情绪标签，不要整段只用同一个。叙述行写具体的感官细节和停顿，不要罗列动作。${c})`:`(System Note: Reroll. 换一个切入角度重写，不要复用上一版的展开思路。依然严格遵守 VN 格式：每一行以 [emotion] 开头并逐行切换情绪，叙述行写具体的感官细节和停顿，不要罗列动作。${c})`;return{messages:[{role:"system",content:l},...r,{role:"user",content:`${s}

${m}`}]}}};export{Z as D,et as O,g as a,Et as b,$t as e,lt as h,nt as r};
