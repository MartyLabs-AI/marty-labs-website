#!/bin/bash

# 🧪 Pre-Deployment Testing Script for Marty Labs
# This script tests all critical functionality before deployment

echo "🚀 Starting Pre-Deployment Testing for Marty Labs"
echo "=============================================="

BASE_URL="http://localhost:3002"
PASS="✅"
FAIL="❌"
WARN="⚠️"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_status="$3"
    
    echo -n "Testing: $test_name ... "
    
    if eval "$test_command"; then
        echo -e "${GREEN}${PASS}${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}${FAIL}${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Test 1: Server Health
echo -e "\n📡 SERVER HEALTH TESTS"
echo "----------------------"

run_test "Homepage loads" \
    "curl -s -o /dev/null -w '%{http_code}' $BASE_URL | grep -q '200'"

run_test "Landing page renders" \
    "curl -s $BASE_URL | grep -q 'Marty Labs'"

run_test "Home page accessible" \
    "curl -s -o /dev/null -w '%{http_code}' $BASE_URL/home | grep -q '200'"

run_test "Flow page accessible" \
    "curl -s -o /dev/null -w '%{http_code}' $BASE_URL/flow/lipsync-producer | grep -q '200'"

# Test 2: API Endpoints
echo -e "\n🔌 API ENDPOINT TESTS"
echo "--------------------"

# Test N8N callback endpoint
run_test "N8N callback endpoint responds" \
    "curl -s -X POST -H 'Content-Type: application/json' -d '{\"generationId\":\"test\",\"status\":\"processing\"}' -o /dev/null -w '%{http_code}' $BASE_URL/api/n8n-callback | grep -q '400'"

# Test 3: External Integrations
echo -e "\n🌐 EXTERNAL INTEGRATION TESTS"
echo "----------------------------"

# Test N8N webhook connectivity
N8N_WEBHOOK_URL="https://pringlenotpringle.app.n8n.cloud/webhook/7d7d0910-2f4f-4de2-9ccd-5ea99b87c38c"

run_test "N8N webhook reachable" \
    "curl -s -X POST -H 'Content-Type: application/json' -d '{\"test\":\"connectivity\"}' -o /dev/null -w '%{http_code}' $N8N_WEBHOOK_URL | grep -q '200'"

# Test Convex connection
echo -e "\n💾 DATABASE TESTS"
echo "----------------"

# Check if Convex is accessible (should return 401 without auth)
run_test "Convex API reachable" \
    "curl -s -o /dev/null -w '%{http_code}' https://quixotic-warthog-148.convex.cloud | grep -q '401\|403'"

# Test 4: File System
echo -e "\n📁 FILE SYSTEM TESTS"
echo "-------------------"

run_test "Environment file exists" \
    "test -f .env.local"

run_test "Package.json exists" \
    "test -f package.json"

run_test "Next.js build files exist" \
    "test -d .next"

# Test 5: Configuration
echo -e "\n⚙️ CONFIGURATION TESTS"
echo "---------------------"

# Check critical environment variables
if grep -q "NEXT_PUBLIC_CONVEX_URL" .env.local; then
    echo -e "Convex URL configured ... ${GREEN}${PASS}${NC}"
    ((TESTS_PASSED++))
else
    echo -e "Convex URL configured ... ${RED}${FAIL}${NC}"
    ((TESTS_FAILED++))
fi

if grep -q "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" .env.local; then
    echo -e "Clerk configured ... ${GREEN}${PASS}${NC}"
    ((TESTS_PASSED++))
else
    echo -e "Clerk configured ... ${RED}${FAIL}${NC}"
    ((TESTS_FAILED++))
fi

if grep -q "N8N_WEBHOOK_URL" .env.local; then
    echo -e "N8N webhook configured ... ${GREEN}${PASS}${NC}"
    ((TESTS_PASSED++))
else
    echo -e "N8N webhook configured ... ${RED}${FAIL}${NC}"
    ((TESTS_FAILED++))
fi

# Test 6: Build Test
echo -e "\n🏗️ BUILD TESTS"
echo "--------------"

echo "Testing production build..."
if npm run build > /tmp/build.log 2>&1; then
    echo -e "Production build succeeds ... ${GREEN}${PASS}${NC}"
    ((TESTS_PASSED++))
else
    echo -e "Production build succeeds ... ${RED}${FAIL}${NC}"
    echo "Build errors:"
    tail -10 /tmp/build.log
    ((TESTS_FAILED++))
fi

# Test Summary
echo -e "\n📊 TEST SUMMARY"
echo "==============="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n🎉 ${GREEN}ALL TESTS PASSED! Ready for deployment!${NC}"
    echo -e "\nNext steps:"
    echo "1. Push to GitHub: git push origin main"
    echo "2. Deploy to Vercel"
    echo "3. Update environment variables in production"
    echo "4. Test with real users"
    exit 0
else
    echo -e "\n${RED}⚠️ $TESTS_FAILED test(s) failed. Please fix issues before deployment.${NC}"
    exit 1
fi