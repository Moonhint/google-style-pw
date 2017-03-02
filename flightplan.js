// flightplan.js
var plan = require('flightplan');
// configuration
// plan.target('staging', {
//   host: 'rockwell-staging-1',
//   username: 'sribu',
//   repository: 'git@github.com:sribu/lora.git',
//   branch: 'staging',
//   agent: process.env.SSH_AUTH_SOCK
// });
plan.target('production', {
  host: 'moonhint',
  username: 'root',
  repository: 'git@github.com:sribu/lora.git',
  branch: 'master',
  agent: process.env.SSH_AUTH_SOCK
});

var tmpDir = 'lora-tmp-' + new Date().getTime();

//// User confirmation && Source clone

// Deployment user confirmation
plan.local(function(local) {
  local.log('Run build');
  if(plan.runtime.target === 'staging'){
    var input = local.prompt('Ready for staging ours work? [yes]');
    if(input.indexOf('yes') === -1) {
      local.abort('canceled flight');
    }
  }else if(plan.runtime.target === 'production'){
    var input = local.prompt('Ready for deploying to production? [yes]');
    if(input.indexOf('yes') === -1) {
      local.abort('canceled flight');
    }
  }
});

//Clone source from github
plan.remote(function(remote) {
  remote.exec('rm -rf clone_base', {failsafe: true});
  remote.log('Cloning Lora');
  remote.exec(`mkdir clone_base && cd clone_base && git clone ${remote.runtime.repository}`);
  // if(plan.runtime.target === 'staging'){
    remote.exec(`cd clone_base/lora && git checkout ${remote.runtime.branch}`, {user: 'sribu'});
  // }
});

/// Dependencies configuration
plan.local(function(local) {/***/});
plan.remote(function(remote) {
  var stdout = remote.find('~/lora-bucket/lora-deploys/ -name lora-tmp-* -type d | sort -r', {silent: true}).stdout;
  // console.info(remote.find('~/lora-bucket/lora-deploys/ -name lora-* -type d'));
  if (stdout) {
    var lora = stdout.split('\n');
    var currentFolder = lora[0];
    remote.log('Previous fluid dependencies recovery');
    remote.sudo('cp -R ' + currentFolder + '/node_modules/ ~/clone_base/lora/', {user: 'sribu'});
    remote.sudo('cp -R ' + currentFolder + '/client/bower_components/ ~/clone_base/lora/client/', {user: 'sribu'});
  }

  remote.log('Install npm dependencies');
  remote.sudo('cd ~/clone_base/lora/ && npm install', {user: 'sribu'});

  remote.log('Install bower dependencies');
  remote.exec('cd ~/clone_base/lora/ && bower install');

});

/// Environment configuration
plan.local(function(local) {/***/});
plan.remote(function(remote) {
  remote.log('Grunt Configuration');
  if(plan.runtime.target === 'staging'){
    remote.sudo('cd ~/clone_base/lora/ && grunt build:staging', {user: 'sribu'});
  }else if(plan.runtime.target === 'production'){
    remote.sudo('cd ~/clone_base/lora/ && grunt build', {user: 'sribu'});
  }

  remote.log('Prepare to deployment area');
  remote.sudo('cp -R ~/clone_base/lora/ ~/lora-bucket/lora-deploys/' + tmpDir , {user: 'sribu'});
  remote.log('Remove tmp clone base');
  remote.exec('rm -rf ~/clone_base');
});

/// Backup plan controll
plan.local(function(local) {/***/});
plan.remote(function(remote) {

  var del = remote.find('~/lora-bucket/lora-deploys/ -name lora-tmp-* -type d | sort -r', {silent: true}).stdout.split('\n');
  var currentFolder = del[0];

  //change last active to backup
  remote.log("Mark last active to backup");
  var prevFolder = del[1];
  remote.exec('mv ' + prevFolder + ' ' + prevFolder + '-backup');

  //remove other redundant backup
  remote.log("Remove redundant backup");
  var keepBackup = 5;
  if(del.length > keepBackup+1){
    for(i=0; i<keepBackup+1; i++){
      del.shift();
    }
    del.pop();
    del.forEach(function(val){
      remote.log(val);
      remote.exec('rm -r ' + val);
    });
  }

  remote.log('Symlink Application');

  if(plan.runtime.target === 'staging'){
    remote.exec('rm -rf ~/lora-bucket/lora', {failsafe: true});
    remote.exec('cd ~/lora-bucket && mkdir lora');
    remote.sudo('ln -snf ~/lora-bucket/lora-deploys/' + tmpDir + '/dist/* ~/lora-bucket/lora', {user: 'sribu'});
    // ln -snf ~/clone_base/lora/* ~/bucket/lora
  }else if(plan.runtime.target === 'production'){
    remote.exec('rm -rf ~/lora-bucket/lora', {failsafe: true});
    remote.exec('cd ~/lora-bucket && mkdir lora');
    remote.sudo('ln -snf ~/lora-bucket/lora-deploys/' + tmpDir + '/dist/* ~/lora-bucket/lora', {user: 'sribu'});
    // remote.sudo('ln -snf ~/deploy/' + tmpDir + '/* ~/kagami.halodiana.com', {user: 'sribu'});
  }

  remote.log('Reload Application');
  if(plan.runtime.target === 'staging'){
    remote.exec('NODE_ENV=staging pm2 stop ~/lora-bucket/lora/server/index.js');
    remote.exec('NODE_ENV=staging pm2 delete ~/lora-bucket/lora/server/index.js');
    remote.exec('NODE_ENV=staging pm2 start ~/lora-bucket/lora/server/index.js');
  }else if(plan.runtime.target === 'production'){
    remote.exec('NODE_ENV=production pm2 stop ~/lora-bucket/lora/server/index.js');
    remote.exec('NODE_ENV=production pm2 delete ~/lora-bucket/lora/server/index.js');
    remote.exec('NODE_ENV=production pm2 start ~/lora-bucket/lora/server/index.js');
  }
});


// Report via telegram bot
plan.local(function(local) {
  if(plan.runtime.target === 'staging'){
    // local.exec('curl -X POST https://api.telegram.org/bot98375273:AAFJLC_sk-Y1l2zMf0aV-l_hUqhSTS8mdNg/sendMessage -d text="[Lora][futura-lora-staging-1] Deploy success #deploy | `git log --pretty=format:\"%h - %an, %ad\" -1`" -d chat_id=-23021044');
    // local.exec('curl -X POST --data-urlencode \'payload={"channel": "#deploy", "username": "DeployBot", "text": "[Lora][futura-lora-staging-1] Deploy success", "icon_emoji": ":cop:"}\' https://hooks.slack.com/services/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');
  }else if(plan.runtime.target === 'production'){
    // local.exec('curl -X POST https://api.telegram.org/bot98375273:AAFJLC_sk-Y1l2zMf0aV-l_hUqhSTS8mdNg/sendMessage -d text="[Lora][lora] Deploy success #deploy | `git log --pretty=format:\"%h - %an, %ad\" -1`" -d chat_id=-23021044');
    // local.exec('curl -X POST --data-urlencode \'payload={"channel": "#deploy", "username": "DeployBot", "text": "[Lora][futura-lora-staging-1] Deploy success", "icon_emoji": ":cop:"}\' https://hooks.slack.com/services/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');
  }
});

plan.remote(function(remote) { /* ... */ });


/// TODO: Disaster controll - RollBack Deployment with option to choose from backup available

///// other response to the events
//
// // executed if flightplan succeeded
// plan.success(function() { /* ... */ });
//
// // executed if flightplan failed
// plan.disaster(function() { /* ... */ });
//
// // always executed after flightplan finished
// plan.debriefing(function() { /* ... */ });
