/**
 * Vercel Environment Variables Import Script (Client)
 * 
 * Usage:
 * 1. Fill in your actual values in .env.production file
 * 2. Install Vercel CLI: npm install -g vercel
 * 3. Login: vercel login
 * 4. Link project: vercel link
 * 5. Run: node import-env-to-vercel.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envFile = '.env.production';

if (!fs.existsSync(envFile)) {
  console.error(`❌ Error: ${envFile} file not found!`);
  console.log('Please create .env.production file first.');
  process.exit(1);
}

console.log('📋 Reading environment variables from .env.production...\n');

const envVars = fs.readFileSync(envFile, 'utf8')
  .split('\n')
  .filter(line => {
    const trimmed = line.trim();
    return trimmed && !trimmed.startsWith('#') && trimmed.includes('=');
  })
  .map(line => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').trim();
    return { 
      key: key.trim(), 
      value: value,
      hasPlaceholder: value.includes('your_') || value.includes('_here')
    };
  });

console.log(`Found ${envVars.length} environment variables:\n`);
envVars.forEach(({ key, value, hasPlaceholder }) => {
  const status = hasPlaceholder ? '⚠️  (needs value)' : '✅';
  console.log(`${status} ${key} = ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
});

const needsUpdate = envVars.filter(v => v.hasPlaceholder);
if (needsUpdate.length > 0) {
  console.log(`\n⚠️  Warning: ${needsUpdate.length} variables have placeholder values.`);
  console.log('Please update .env.production file with actual values before importing.\n');
}

rl.question('Do you want to continue? (y/n): ', (answer) => {
  if (answer.toLowerCase() !== 'y') {
    console.log('Cancelled.');
    rl.close();
    return;
  }

  console.log('\n🚀 Starting import to Vercel...\n');

  const environments = ['production', 'preview', 'development'];
  let successCount = 0;
  let errorCount = 0;

  envVars.forEach(({ key, value, hasPlaceholder }) => {
    if (hasPlaceholder) {
      console.log(`⏭️  Skipping ${key} (has placeholder value)`);
      return;
    }

    environments.forEach(env => {
      try {
        console.log(`📤 Adding ${key} to ${env}...`);
        execSync(`echo "${value}" | vercel env add ${key} ${env}`, {
          stdio: 'pipe',
          encoding: 'utf8'
        });
        console.log(`✅ ${key} added to ${env}`);
        successCount++;
      } catch (error) {
        const errorMsg = error.message || error.toString();
        if (errorMsg.includes('already exists')) {
          console.log(`ℹ️  ${key} already exists in ${env}, skipping...`);
        } else {
          console.error(`❌ Error adding ${key} to ${env}:`, errorMsg);
          errorCount++;
        }
      }
    });
  });

  console.log('\n📊 Summary:');
  console.log(`✅ Successfully added: ${successCount} variables`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('\n✨ Done! Please redeploy your project in Vercel dashboard.\n');

  rl.close();
});

