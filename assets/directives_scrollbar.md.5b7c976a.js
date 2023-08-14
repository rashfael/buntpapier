import{_ as o,a5 as n,o as l,c as t,a6 as r,X as a,k as s}from"./chunks/framework.7cbdee8e.js";const A=JSON.parse('{"title":"v-scrollbar","description":"","frontmatter":{"title":"v-scrollbar"},"headers":[],"relativePath":"directives/scrollbar.md","filePath":"directives/scrollbar.md"}'),c={name:"directives/scrollbar.md"},i=a('<h1 id="v-scrollbar" tabindex="-1">v-scrollbar <a class="header-anchor" href="#v-scrollbar" aria-label="Permalink to &quot;v-scrollbar&quot;">​</a></h1><p>Uses native scrolling (<code>overflow: scroll</code>) but hides the native scrollbars and displays our own.</p><p><code>v-scrollbar.x.y</code> : scrolling both axis</p><p><code>v-scrollbar.x</code> | <code>v-scrollbar.y</code> : scrolling one axis</p><p>CAUTION: in pug, you need to use <code>v-scrollbar.x=&quot;&quot;</code> (empty value)</p>',5),p={class:"scrollbar"},d=s("div",{class:"scrolling-content"},null,-1),_=s("div",{class:"scrolling-content"},null,-1),y=s("div",{class:"scrolling-content"},null,-1),v=[d,_,y],D=a(`<div class="language-html"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">v-scrollbar.x.y</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;&lt;/</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;&lt;/</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;&lt;/</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;</span></span></code></pre></div><h2 id="modifiers" tabindex="-1">modifiers <a class="header-anchor" href="#modifiers" aria-label="Permalink to &quot;modifiers&quot;">​</a></h2><table><thead><tr><th style="text-align:left;">modifier</th><th style="text-align:left;">description</th></tr></thead><tbody><tr><td style="text-align:left;">x</td><td style="text-align:left;">scroll x axis</td></tr><tr><td style="text-align:left;">y</td><td style="text-align:left;">scroll y axis</td></tr></tbody></table>`,3);function F(h,b,u,g,x,f){const e=n("scrollbar");return l(),t("div",null,[i,r((l(),t("div",p,v)),[[e,,void 0,{x:!0,y:!0}]]),D])}const C=o(c,[["render",F]]);export{A as __pageData,C as default};
