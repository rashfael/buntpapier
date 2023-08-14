import{_ as o,K as p,o as r,c as D,O as n,k as e,a as y,X as c}from"./chunks/framework.7cbdee8e.js";const F={data(){return{inputText:""}}},A=JSON.parse('{"title":"input","description":"","frontmatter":{"title":"input"},"headers":[],"relativePath":"components/input.md","filePath":"components/input.md"}'),i=e("h1",{id:"input",tabindex:"-1"},[y("input "),e("a",{class:"header-anchor",href:"#input","aria-label":'Permalink to "input"'},"​")],-1),d={class:"dark-background"},u=c(`<h3 id="template" tabindex="-1">template <a class="header-anchor" href="#template" aria-label="Permalink to &quot;template&quot;">​</a></h3><div class="language-html"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">bunt-input</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">id</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">input-normal</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">v-model</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">inputText</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">name</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">an-input</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">label</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">ein lustiges Eingabefeld</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">hint</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">mit einem lustigen Hinweis</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">/&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">bunt-input</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">id</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">input-password</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">v-model</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">inputText</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">type</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">password</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">name</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">password-input</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">label</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Password</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">/&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">bunt-input</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">id</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">input-disabled</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">value</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">a disabled value</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">name</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">disabled-input</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">label</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">this input is disabled</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">hint</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">with a hint</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">:disabled</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">true</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">/&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">bunt-input</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">id</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">input-placeholder</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">v-model</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">inputText</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">name</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">input-placeholder</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">placeholder</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">I am a placeholder, not a label</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">icon</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">search</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> /&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">bunt-input</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">id</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">input-compact</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">v-model</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">inputText</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">name</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">compact-input</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">label</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">a compact input</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">/&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">bunt-input</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">id</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">input-large</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">v-model</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">inputText</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">name</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">large-input</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">label</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">a large input</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">/&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">class</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">dark-background</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">bunt-input</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">id</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">input-dark</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">v-model</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">inputText</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">name</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">dark-input</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">label</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">an input on dark background</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">hint</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">with a hint</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">/&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;</span></span></code></pre></div><h3 id="style" tabindex="-1">style <a class="header-anchor" href="#style" aria-label="Permalink to &quot;style&quot;">​</a></h3><div class="language-stylus"><button title="Copy Code" class="copy"></button><span class="lang">stylus</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">#</span><span style="color:#F78C6C;">input-normal</span><span style="color:#A6ACCD;">, </span><span style="color:#89DDFF;">#</span><span style="color:#F78C6C;">input-password</span><span style="color:#A6ACCD;">, </span><span style="color:#89DDFF;">#</span><span style="color:#F78C6C;">input-disabled</span><span style="color:#A6ACCD;">, </span><span style="color:#89DDFF;">#</span><span style="color:#F78C6C;">input-placeholder</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#B2CCD6;">width</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">420px</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#82AAFF;">input-style</span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#89DDFF;">#</span><span style="color:#F78C6C;">input-compact</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#B2CCD6;">width</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">420px</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#82AAFF;">input-style</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">size</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">compact</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#89DDFF;">#</span><span style="color:#F78C6C;">input-large</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#B2CCD6;">width</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">420px</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#82AAFF;">input-style</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">size</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">large</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#89DDFF;">#</span><span style="color:#F78C6C;">input-dark</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#B2CCD6;">width</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">420px</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#82AAFF;">input-style</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">style</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">dark</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">)</span></span></code></pre></div><h2 id="props" tabindex="-1">props <a class="header-anchor" href="#props" aria-label="Permalink to &quot;props&quot;">​</a></h2><table><thead><tr><th style="text-align:left;">prop</th><th style="text-align:left;">type</th><th style="text-align:left;">required</th><th style="text-align:left;">default</th><th style="text-align:left;">description</th></tr></thead><tbody><tr><td style="text-align:left;">type</td><td style="text-align:left;">string</td><td style="text-align:left;">false</td><td style="text-align:left;">&#39;text&#39;</td><td style="text-align:left;">native input type</td></tr><tr><td style="text-align:left;">name</td><td style="text-align:left;">string</td><td style="text-align:left;">true</td><td style="text-align:left;"></td><td style="text-align:left;">native input name</td></tr><tr><td style="text-align:left;">label</td><td style="text-align:left;">string</td><td style="text-align:left;">false</td><td style="text-align:left;"></td><td style="text-align:left;">floating label</td></tr><tr><td style="text-align:left;">placeholder</td><td style="text-align:left;">string</td><td style="text-align:left;">false</td><td style="text-align:left;"></td><td style="text-align:left;">native placeholder text</td></tr><tr><td style="text-align:left;">hint</td><td style="text-align:left;">string</td><td style="text-align:left;">false</td><td style="text-align:left;"></td><td style="text-align:left;">hint text</td></tr><tr><td style="text-align:left;">hintIsHtml</td><td style="text-align:left;">boolean</td><td style="text-align:left;">false</td><td style="text-align:left;">false</td><td style="text-align:left;">pass <code>hint</code> through <code>v-html</code> (potentially unsave)</td></tr><tr><td style="text-align:left;">icon</td><td style="text-align:left;">string</td><td style="text-align:left;">false</td><td style="text-align:left;"></td><td style="text-align:left;">mdi icon name to display</td></tr><tr><td style="text-align:left;">value</td><td style="text-align:left;">string|number</td><td style="text-align:left;">false</td><td style="text-align:left;">&#39;&#39;</td><td style="text-align:left;">value (or use v-model)</td></tr><tr><td style="text-align:left;">disabled</td><td style="text-align:left;">boolean</td><td style="text-align:left;">false</td><td style="text-align:left;">false</td><td style="text-align:left;">disables input</td></tr><tr><td style="text-align:left;">validation</td><td style="text-align:left;">object</td><td style="text-align:left;">false</td><td style="text-align:left;"></td><td style="text-align:left;">vuelidate object (see validation)</td></tr></tbody></table><h2 id="slots" tabindex="-1">slots <a class="header-anchor" href="#slots" aria-label="Permalink to &quot;slots&quot;">​</a></h2><table><thead><tr><th style="text-align:left;">slot</th><th style="text-align:left;">description</th></tr></thead></table><h2 id="events" tabindex="-1">events <a class="header-anchor" href="#events" aria-label="Permalink to &quot;events&quot;">​</a></h2><table><thead><tr><th style="text-align:left;">event</th><th style="text-align:left;">args</th><th style="text-align:left;">description</th></tr></thead><tbody><tr><td style="text-align:left;">input</td><td style="text-align:left;">value</td><td style="text-align:left;">emitted on every keypress or input (or use v-model)</td></tr></tbody></table><h2 id="style-mixin-parameters" tabindex="-1">style mixin parameters <a class="header-anchor" href="#style-mixin-parameters" aria-label="Permalink to &quot;style mixin parameters&quot;">​</a></h2><table><thead><tr><th style="text-align:left;">parameter</th><th style="text-align:left;">type</th><th style="text-align:left;">default</th><th style="text-align:left;">description</th></tr></thead><tbody><tr><td style="text-align:left;">style</td><td style="text-align:left;">&#39;light&#39;, &#39;dark&#39;</td><td style="text-align:left;">&#39;link&#39;</td><td style="text-align:left;">button style</td></tr><tr><td style="text-align:left;">size</td><td style="text-align:left;">&#39;dense&#39;, &#39;large&#39;, &#39;compact&#39;</td><td style="text-align:left;">&#39;dense&#39;</td><td style="text-align:left;">input size (compact does not reserve space for a hint)</td></tr></tbody></table>`,12);function C(g,s,x,h,t,f){const a=p("bunt-input");return r(),D("div",null,[i,n(a,{id:"input-normal",modelValue:t.inputText,"onUpdate:modelValue":s[0]||(s[0]=l=>t.inputText=l),name:"an-input",label:"ein lustiges Eingabefeld",hint:"mit einem lustigen Hinweis"},null,8,["modelValue"]),n(a,{id:"input-password",modelValue:t.inputText,"onUpdate:modelValue":s[1]||(s[1]=l=>t.inputText=l),type:"password",name:"password-input",label:"Password"},null,8,["modelValue"]),n(a,{id:"input-disabled",value:"a disabled value",name:"disabled-input",label:"this input is disabled",hint:"with a hint",disabled:!0}),n(a,{id:"input-placeholder",modelValue:t.inputText,"onUpdate:modelValue":s[2]||(s[2]=l=>t.inputText=l),name:"input-placeholder",placeholder:"I am a placeholder, not a label",icon:"search"},null,8,["modelValue"]),n(a,{id:"input-compact",modelValue:t.inputText,"onUpdate:modelValue":s[3]||(s[3]=l=>t.inputText=l),name:"compact-input",label:"a compact input"},null,8,["modelValue"]),n(a,{id:"input-large",modelValue:t.inputText,"onUpdate:modelValue":s[4]||(s[4]=l=>t.inputText=l),name:"large-input",label:"a large input"},null,8,["modelValue"]),e("div",d,[n(a,{id:"input-dark",modelValue:t.inputText,"onUpdate:modelValue":s[5]||(s[5]=l=>t.inputText=l),name:"dark-input",label:"an input on dark background",hint:"with a hint"},null,8,["modelValue"])]),u])}const q=o(F,[["render",C]]);export{A as __pageData,q as default};