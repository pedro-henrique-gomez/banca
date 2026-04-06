# Script para renomear arquivos de imagem para formato padronizado

Write-Host "Iniciando renomeamento de arquivos para formato padronizado..."
Write-Host ""

# Mapeamento manual dos arquivos atuais para os novos nomes padronizados
$mapeamento = @{
    "Marlboro Vermelho.png" = "marlboro_red.png"
    "Marlboro gold.png" = "marlboro_gold.png"
    "dunhill azul.png" = "dunhill_azul.png"
    "dunhill carlton.png" = "dunhill_carlton.png"
    "dunhill double refresh.png" = "dunhill_double_refresh.png"
    "dunhill mix refresh.png" = "dunhill_mix_refresh.png"
    "gudang garam.png" = "gudang_garam.png"
    "kent derby azul.png" = "kent_derby_azul.png"
    "kent derby silver.png" = "kent_derby_silver.png"
    "lucky azul.png" = "lucky_strike_azul.png"
    "lucky double.png" = "lucky_strike_double.png"
    "lucky red.png" = "lucky_strike_red.png"
    "marlboro blue ice.png" = "marlboro_blue_ice.png"
    "marlboro melancia.png" = "marlboro_melancia.png"
    "rothmans minister  prata.png" = "rothmans_prata.png"
    "rothmans minister  purple boost.png" = "rothmans_purple_boost.png"
    "rothmans minister azul.png" = "rothmans_azul.png"
    "rothmans minister global azul.png" = "rothmans_global_azul.png"
    "rothmans minister global red.png" = "rothmans_global_red.png"
    "rothmans minister red.png" = "rothmans_global_red.png"
    "souza paiol.png" = "souza_paiol.png"
    "coca lata comum.png" = "coca_cola_lata.png"
    "coca lata zero.png" = "coca_cola_zero_lata.png"
    "H2OH! limoneto.png" = "h2oh_500ml.png"
    "coca comum 1,5l.png" = "coca_cola_1.5l.png"
    "coca zero 1,5l.png" = "coca_cola_zero_1.5l.png"
    "dell vale uva.png" = "dell_vale_uva_200ml.png"
    "gatorade sabores.png" = "gatorade_sabores.png"
    "guaravita.png" = "guaravita.png"
    "mate leão.png" = "mate_leão_290ml.png"
    "tabaco acrema.png" = "tabaco_acrema_25g.png"
    "tabaco amsterdam.png" = "tabaco_amsterdam.png"
    "tabaco hi tobacco.png" = "tabaco_hi_tobacco_25g.png"
    "tabaco veio pimenta 25g.png" = "tabaco_veio_pimenta_25g.png"
    "tabaco veio pimenta 50g.png" = "tabaco_veio_pimenta_50g.png"
    "filtro hi tobacco slim.png" = "filtro_hi_tobacco_slim.png"
    "filtro papelito longo.png" = "filtro_papelito_longo.png"
    "celulose aleda.png" = "celulose_aleda.png"
    "piteira bem bolado pop large.png" = "piteira_bem_bolado_pop_large.png"
    "piteira bem bolado pop.png" = "piteira_bem_bolado_pop_1_4.png"
    "piteira bem bolado slim.png" = "piteira_bem_bolado_slim.png"
    "piteira the og small.png" = "piteira_the_og_small.png"
    "piteira THE OG XL.png" = "piteira_the_og_xl.png"
    "seda bem bolado brown.png" = "seda_bem_bolado_brown.png"
    "seda bem bolado pop mini.png" = "seda_bem_bolado_pop_mini.png"
    "seda bem bolado pop slim.png" = "seda_bem_bolado_pop_slim.png"
    "seda bros 66 blue.png" = "seda_bros_66_blue.png"
    "seda bros premim pink.png" = "seda_bros_premium_pink.png"
    "seda bros premium black.png" = "seda_bros_premium_black.png"
    "seda bros silver.png" = "seda_bros_silver.png"
    "seda bross 66 brown.png" = "seda_bros_66_brown.png"
    "seda GTI 35.png" = "seda_gti_35.png"
    "seda GTI 50.png" = "seda_gti_50.png"
    "seda smolking brown.png" = "seda_smolking_brown.png"
    "seda smolking master.png" = "seda_smolking_master.png"
    "seda zomo alfafa.png" = "seda_zomo_alfafa.png"
    "seda zomo classic monster.png" = "seda_zomo_classic_monster.png"
    "seda zomo mini black.png" = "seda_zomo_mini_black.png"
    "seda zomo natural mini.png" = "seda_zomo_natural_slim.png"
    "seda zomo natural monster.png" = "seda_zomo_perfect_black.png"
    "seda zomo natural perfect.png" = "seda_zomo_perfect_hemp.png"
    "seda zomo natural slim.png" = "seda_zomo_natural_slim.png"
    "seda zomo perfect black.png" = "seda_zomo_perfect_black.png"
    "seda zomo perfect hemp.png" = "seda_zomo_perfect_hemp.png"
    "seda zomo perfect pink.png" = "seda_zomo_perfect_pink.png"
    "seda zomo slim.png" = "seda_zomo_slim.png"
}

# Executar renomeamento
foreach ($arquivoAtual in $mapeamento.Keys) {
    $novoNome = $mapeamento[$arquivoAtual]
    
    if (Test-Path $arquivoAtual) {
        try {
            Rename-Item -Path $arquivoAtual -NewName $novoNome -ErrorAction Stop
            Write-Host "✅ Renomeado: $arquivoAtual → $novoNome"
        } catch {
            Write-Host "❌ Erro ao renomear $arquivoAtual : $($_.Exception.Message)"
        }
    } else {
        Write-Host "❌ Arquivo não encontrado: $arquivoAtual"
    }
}

Write-Host ""
Write-Host "Renomeamento concluído!"
Write-Host ""
Write-Host "Arquivos na pasta após renomeamento:"
Get-ChildItem *.png | Sort-Object Name | ForEach-Object { Write-Host "  $($_.Name)" }
