---
title: tabs
---
# tabs
## actually two components

<br>
<br>

<script>
export default {
	data () {
		return {
			activeTab: '',
			activateTab: false,
			selectedEvents: []
		}
	}
}
</script>


<bunt-tabs class="tabs-default" v-model="activeTab">
<bunt-tab id="Tab 1" header="Tab 1" @selected="selectedEvents.push(`selected ${$event}`)" @deselected="selectedEvents.push(`deselected ${$event}`)"/>
<bunt-tab id="Tab 2" header="Tab 2" @selected="selectedEvents.push(`selected ${$event}`)" @deselected="selectedEvents.push(`deselected ${$event}`)"/>
<bunt-tab id="longer Heading" header="A longer Tab Heading" @selected="selectedEvents.push(`selected ${$event}`)" @deselected="selectedEvents.push(`deselected ${$event}`)"/>
</bunt-tabs>
<bunt-button @click="activeTab = null">deselect</bunt-button>
<p>Selected Tab: {{ activeTab }}</p>
<ul>
<li v-for="event of selectedEvents">{{ event }}</li>
</ul>
<h4>active tab via index</h4>
<bunt-tabs class="tabs-default" :active-tab="1">
	<bunt-tab v-for="tab of ['Tab 1', 'Tab 2', 'A longer Tab Heading']" :header="tab" />
</bunt-tabs>
<h4>tab bodies</h4>
<bunt-tabs class="tabs-default" :active-tab="'one'">
	<bunt-tab id="one" header="Tab 1">
		<h1>I AM A TAB</h1>
	</bunt-tab>
	<bunt-tab id="two" header="Tab 2">
		<h1> I AM ANOTHER TAB</h1>
	</bunt-tab>
	<bunt-tab id="three" header="A longer Tab Heading" />
</bunt-tabs>
	<bunt-tabs class="tabs-default" :active-tab="1">
	<bunt-tab header="Tab 1" />
	<bunt-tab v-if="activateTab" header="A dynamic Tab Heading" />
	<bunt-tab header="Tab 2" />
</bunt-tabs>
<bunt-switch id="switch-tabs" name="switch-tabs" label="toggle tab" v-model="activateTab" />

### template
```html
<bunt-tabs class="tabs-default" :active-tab="activeTab">
	<bunt-tab id="Tab 1" header="Tab 1" @selected="activeTab = 'Tab 1'" />
	<bunt-tab id="Tab 2" header="Tab 2" @selected="activeTab = 'Tab 2'" />
	<bunt-tab id="longer Heading" header="A longer Tab Heading" @selected="activeTab = 'longer Heading'" />
</bunt-tabs>
<p>Selected Tab: {{ activeTab }}</p>
<h4>active tab via index</h4>
<bunt-tabs class="tabs-default" :active-tab="1">
	<bunt-tab header="Tab 1" />
	<bunt-tab header="Tab 2" />
	<bunt-tab header="A longer Tab Heading" />
</bunt-tabs>
<h4>tab bodies</h4>
<bunt-tabs class="tabs-default" :active-tab="'one'">
	<bunt-tab id="one" header="Tab 1">
		<h1>I AM A TAB</h1>
	</bunt-tab>
	<bunt-tab id="two" header="Tab 2">
		<h1> I AM ANOTHER TAB</h1>
	</bunt-tab>
	<bunt-tab id="three" header="A longer Tab Heading" />
</bunt-tabs>
<bunt-tabs class="tabs-default" :active-tab="1">
	<bunt-tab header="Tab 1" />
	<bunt-tab v-if="activateTab" header="A dynamic Tab Heading" />
	<bunt-tab header="Tab 2" />
</bunt-tabs>
<bunt-switch id="switch-tabs" name="switch-tabs" label="toggle tab" v-model="activateTab" />
```

### style
```stylus
.tabs-default
	tabs-style()
```

## bunt-tabs
### props
| prop | type | required | default | description |
|:-----|:-----|:---------|:--------|:------------|
| activeTab | number\|string | true | | active tab id |

### slots

| slot | description |
|:-----|:------------|
| default | put `bunt-tab` components here |
| headerItem | customize header item rendering. Receives the tab id and the header object. |

## bunt-tab
### props
| prop | type | required | default | description |
|:-----|:-----|:---------|:--------|:------------|
| id | string | false | | tab id used in bunt-tabs' `active-tab` |
| header | string, object | true | | header label. If you're using the headerItem slot, you can pass an object to it here. |
| icon | string | false | | mdi icon name |
| disabled | boolean | false | false | disables input |

### slots

| slot | description |
|:-----|:------------|
| default | tab body |

### events

| event | args | description |
|:------|:-----|:------------|
| selected | id | emitted when tab is selected |
| deselected | id | emitted when tab is deselected |

## style mixin parameters
| parameter | type | default | description |
|:----------|:-----|:--------|:------------|
| background-color | color | $clr-grey-200 | background color |
| color | color | $clr-secondary-text-light | header text color |
| active-color | color | $clr-primary | active header text color |
| indicator-color | color | $clr-primary | indicator color |
