# Script para renomear arquivos de imagem baseado nos nomes dos produtos
$produtos = @{
    "Marlboro Red" = "marlboro_vermelho.png"
    "Marlboro Gold" = "marlboro_gold.png"
    "Dunhill Azul" = "dunhill_azul.png"
    "Dunhill Carlton" = "dunhill_carlton.png"
    "Dunhill Double Refresh" = "dunhill_double_refresh.png"
    "Dunhill Mix Refresh" = "dunhill_mix_refresh.png"
    "Gudang Garam" = "gudang_garam.png"
    "Kent Derby Azul" = "kent_derby_azul.png"
    "Kent Derby Silver" = "kent_derby_silver.png"
    "Lucky Strike Azul" = "lucky_azul.png"
    "Lucky Strike Double" = "lucky_double.png"
    "Lucky Strike Red" = "lucky_red.png"
    "Marlboro Blue Ice" = "marlboro_blue_ice.png"
    "Marlboro Melancia" = "marlboro_melancia.png"
    "Rothmans Prata" = "rothmans_prata.png"
    "Rothmans Purple Boost" = "rothmans_purple_boost.png"
    "Rothmans Azul" = "rothmans_azul.png"
    "Rothmans Global Azul" = "rothmans_global_azul.png"
    "Rothmans Global Red" = "rothmans_global_red.png"
    "Souza Paiol" = "souza_paiol.png"
    "Coca-Cola Lata" = "coca_lata_comum.png"
    "Coca-Cola Zero Lata" = "coca_lata_zero.png"
    "H2OH 500ml" = "H2OH_limoneto.png"
    "Coca-Cola 1.5L" = "coca_comum_1.5l.png"
    "Coca-Cola Zero 1.5L" = "coca_zero_1.5l.png"
    "Dell Vale Uva 200ml" = "dell_vale_uva.png"
    "Gatorade Sabores" = "gatorade_sabores.png"
    "Guaravita" = "guaravita.png"
    "Mate Leão 290ml" = "mate_leão.png"
    "Tabaco Acrema 25g" = "tabaco_acrema.png"
    "Tabaco Amsterdam" = "tabaco_amsterdam.png"
    "Tabaco HI Tobacco 25g" = "tabaco_hi_tobacco.png"
    "Tabaco Veio Pimenta 25g" = "tabaco_veio_pimenta_25g.png"
    "Tabaco Veio Pimenta 50g" = "tabaco_veio_pimenta_50g.png"
    "Filtro HI Tobacco Slim" = "filtro_hi_tobacco_slim.png"
    "Filtro Papelito Longo" = "filtro_papelito_longo.png"
    "Celulose Aleda" = "celulose_aleda.png"
    "Piteira Bem Bolado Pop Large" = "piteira_bem_bolado_pop_large.png"
    "Piteira Bem Bolado Pop 1/4" = "piteira_bem_bolado_pop.png"
    "Piteira Bem Bolado Slim" = "piteira_bem_bolado_slim.png"
    "Piteira The OG Small" = "piteira_the_og_small.png"
    "Piteira The OG XL" = "piteira_THE_OG_XL.png"
    "Seda Bem Bolado Brown" = "seda_bem_bolado_brown.png"
    "Seda Bem Bolado Pop Mini" = "seda_bem_bolado_pop_mini.png"
    "Seda Bem Bolado Pop Slim" = "seda_bem_bolado_pop_slim.png"
    "Seda Bros 66 Blue" = "seda_bros_66_blue.png"
    "Seda Bros Premium Pink" = "seda_bros_premim_pink.png"
    "Seda Bros Premium Black" = "seda_bros_premium_black.png"
    "Seda Bros Silver" = "seda_bros_silver.png"
    "Seda Bros 66 Brown" = "seda_bross_66_brown.png"
    "Seda GTI 35" = "seda_GTI_35.png"
    "Seda GTI 50" = "seda_GTI_50.png"
    "Seda Smolking Brown" = "seda_smolking_brown.png"
    "Seda Smolking Master" = "seda_smolking_master.png"
    "Seda Zomo Alfafa" = "seda_zomo_alfafa.png"
    "Seda Zomo Classic Monster" = "seda_zomo_classic_monster.png"
    "Seda Zomo Mini Black" = "seda_zomo_mini_black.png"
    "Seda Zomo Natural Slim" = "seda_zomo_natural_slim.png"
    "Seda Zomo Perfect Black" = "seda_zomo_perfect_black.png"
    "Seda Zomo Perfect Hemp" = "seda_zomo_perfect_hemp.png"
    "Seda Zomo Slim" = "seda_zomo_slim.png"
}

# Mapeamento reverso para encontrar qual produto corresponde a qual arquivo
$arquivoParaProduto = @{}

foreach ($produto in $produtos.Keys) {
    $arquivoParaProduto[$produtos[$produto]] = $produto
}

Write-Host "Iniciando renomeamento de arquivos..."
Write-Host ""

# Renomear arquivos
foreach ($arquivoAtual in $arquivoParaProduto.Keys) {
    $caminhoAtual = Join-Path "." $arquivoAtual
    
    if (Test-Path $caminhoAtual) {
        # Gerar novo nome usando a função do sistema
        $produtoNome = $arquivoParaProduto[$arquivoAtual]
        $novoNome = $produtoNome.ToLower() -replace "[^\w\s-]", "" -replace "\s+", "_" -replace "-+", "_"
        $novoNome = "$novoNome.png"
        
        if ($arquivoAtual -ne $novoNome) {
            try {
                Rename-Item -Path $arquivoAtual -NewName $novoNome -ErrorAction Stop
                Write-Host "✅ Renomeado: $arquivoAtual → $novoNome"
            } catch {
                Write-Host "❌ Erro ao renomear $arquivoAtual : $($_.Exception.Message)"
            }
        } else {
            Write-Host "⏭️  Já está correto: $arquivoAtual"
        }
    } else {
        Write-Host "❌ Arquivo não encontrado: $arquivoAtual"
    }
}

Write-Host ""
Write-Host "Renomeamento concluído!"
Write-Host ""
Write-Host "Arquivos na pasta:"
Get-ChildItem *.png | Sort-Object Name | ForEach-Object { Write-Host "  $($_.Name)" }
